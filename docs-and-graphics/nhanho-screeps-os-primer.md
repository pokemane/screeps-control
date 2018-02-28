*Taken from the `#operatingsystems` slack channel pins in the screeps workspace, originally written by @nhanho I think.  Included here for my own reference.*

Writing an OS for Screeps
===
This guide assumes you're reasonably familiar with Screeps. Although I will be building everything from scratch up until a simple multiple rooms mining economy, since there will be a longer ramp up time than usual before you can see your game play change, it might not be ideal to newer players without the interactive fun of working directly in your game code. It would probably be best for your first or second rewrite, when you decide to throw out all the tutorial code.

Disclaimer: There will be code, lots and lots of code before you can even see anything working.

# Why OS? #

> An operating system (OS) is system software that manages ~~computer hardware~~ CPU and ~~software resources~~ energy and minerals  and provides common services for ~~computer programs~~ creep tasks


## Scenario: Mineral mining ##

We got a basic economy going, and a function `mine(flagName)` that we can call on a flag to start mining the resource on that flag and bringing it back to our storage. We decide to start mining mineral, because **shiny** creep is great! And since we already have code to mine normal sources, let's repurpose it. Put down a new flag, add it to the mining list, and done!

However, mineral regenerates differently than sources: sources start their countdown whenever `source.energy < source.energyCapacity`, minerals only start regeneration timer when the remaining amount is 0 and has 50000 ticks cooldown time. **We can not continuously mine mineral the same way you do with energy source**. After the mineral deposit runs out, we will need to stop calling the `mine` function, so let's add a change to do that.

``` javascript
	let mineral = getMineralWithMagic(flagName);
	if (mineral.mineralAmount > 0)
		let result = mining(flagName)
```

The previous issue of spawning extra miner and couriers when there is nothing to mine is fixed. Unfortunately this also causes a small bug: right when `mineral.mineralAmount` reachs 0, there would be still mineral to be ferried back to the storage. The `mine` function is not run at all, so our couriers also stops working. The proper fix is to let the courier finishing their job, while not trying to spawn or replace them.

This is a very common scenario, especially with couriers when we want them to continue doing their tasks, but not respawning or starting the task again if the creeps are dead. **More generally, we want to have fine control on when and how certain part of code (or *process*) is run or started**. It can be accomplished with lots and lots of `if`, but obviously gets unwiedly after a while.

## Scenario: Tasks priority ##

We have two very CPU consuming tasks: running reactions in lab and invading some noob's room. Normally, we want to reserve all your CPU for running reactions (which can takes up ~60cpu/ ticks in my case), then use whatever leftover CPU to run the invading code. It might look like this:

``` javascript
	runReactions();
	if (Game.cpu.getUsed() > 50)
		RAWR()

```

One day, a wolf in sheep clothing pops up in our sector, he has killed everyone else. Obviously we can't let him stay, so we have to kill him. We decide to put priority on your invading code instead: all the cpu will be used for war, with whatever leftover being used for lab reactions. Well, time to copy & paste to swap those two lines. Let's make a note to make sure we know to swap them back after everything's done.

There are different tasks in the game that we want to run in a certain order. If we want to be able to change the order of execution for those tasks, they needs to be modulize into separate components. Then we have something that will execute those components one-by-one, sorting them by some kind of ordering. Sounds familiar?

Since this confused me when I first started to implement this framework/OS, let's do a quick definition first:

# What is a process #
A running process is some code that is run every tick until the process is stopped. Because of Screeps's execution model, that means our kernel will have the task of storing the list of "running process" as well as running them every tick. So when we start a process, it means that we make sure a specific piece of code will be run everytick.

# Kernel #

At the very basics, a kernel is something that manage our processes: we can add a process, kill a process, get a process from its ID, and in Screeps case, also storing and running the process everytick.


## Data structure ##

We need something to store our process. For simplicity, we will use two variables to store our process's info right now: a `processTable` that is a key/value store of pid/process, and a `processQueue` that is populated at the start of every tick from `processTable`, which is the queue of all processes to be run this tick. For now, assuming there will be enough CPU to run all processes in a tick.

Every process will be an object of class `Process`, which has its own `pid`, its `parentPID` and a function `run` that takes an memory object that you can modify and store anything in it as necessary. Since we're using the default `Memory` serializer, the memory object passed to each process will be a mutable object such that any changes will be reflected directly in `Memory`. Since we have to create a process object everytick from stored process table in memory, we will also need a `className` property to do so.

## Simple kernel ##

At the start of every gametick, we have to create the `processTable` and `processQueue` back from Memory. Our serialized `processTable` will be a 3-tuple of (pid, parentPID, className). `pid` and `parentPID` is called with the constructor of `className`, then `reloadFromMemory` is called on the process's memory to load any data as needed. To store our current processes, we loop through the processTable, filter all the dead processes and write `(pid, parentPID, className)` of each `Process` into memory.

Adding a process means getting a new pid, assign the `Process` to the pid key on `processTable` (we don't update the `processQueue` of the current tick). To kill a process, we simply set its `status` to `DEAD`, this will cause our `processTable` serializer to ignore it when writing it down, effectively removing it next game tick.

With our current queue design, a process after being added will only start to run in the next game tick.

The code will be in Typescript since that's what I'm using, hence it will not be suitable for copy-paste. But translating it to JS is simple.

```typescript
	///process.d.ts
	interface Process {
		readonly pid: number;
		readonly parentPID;
	}
```

```typescript
	///process.ts
	abstract class Process {
		constructor(pid: number, parentPID: number, memory: any) {
			this.pid = pid;
			this.parentPID = parentPID;
		}
		readonly pid: number;
		readonly parentPID: number;
		abstract public run(memory: any);
		abstract public reloadFromMemory(memory: any);
	}
```
```typescript
	///kernel.ts
	let processQueue: Process[] = [];
	let processTable: { [pid: string]: Process } = {};

	let reboot = function() {
		processQueue = [];
		processTable = {};
	};

	let getFreePid = function () {
		let currentPids = _.sortBy(_.map(processTable, p => p.pid));
		let counter = -1;
		for (let pid of currentPids) {
			counter += 1;
			if (pid !== counter)
				return counter;
	    }
		return currentPids.length;
	};

	export let addProcess = function <T extends Process>(p: T) {
		let pid = getFreePid();
		p.pid = pid;
		processTable[p.pid] = p;
		return p;
	};

	export let killProcess = function (pid: number) {
		processTable[pid].status = ProcessStatus.Killed;
		Memory.processMemory[pid] = undefined;
		//Right now, we will also kill any child process when a process is killed.
		//TODO : implement it here

		return pid;
	};

	export let getProcessById = function (pid: number): Process {
		return processTable[pid];
	};


	export let storeProcessTable = function() {
		let aliveProcess = _.filter(_.values(processTable), (p: Process) => p.status!= ProcessStatus.DEAD);
		Memory["processTable"] = _.map((p: Process) => (p.pid, p.parentPID, p.className));
	};

	let getProcessMemory = function (p: Process) {
		Memory.processMemory = Memory.processMemory || {};
		let pid = p.pid;
		Memory.processMemory[pid] = Memory.processMemory[pid] || {};
		return Memory.processMemory[pid];
	};

	export let run = function() {
		while (processQueue.length > 0) {
			let process = processQueue.pop();
			try {
				if (process.status !== ProcessStatus.DEAD)
					process.run(getProcessMemory(process));
			} catch (e) {
				console.log ("Fail to run process:" + p.pid);
			}
	    }
	};

	export let loadProcessTable = function () {
		reboot();
		let storedTable = <SerializedProcess[]>Memory["processTable"];
		for (let item of storedTable) {
			let pid: number, parentPID: number, className: string = item;
			try {
				let processClass = require(className);
				let p = new processClass(pid, parentPID);
				p.reloadFromMemory(getProcessMemory(p));
				processTable[p.pid] = p;
				processQueue.push(p);
			} catch (e) {
				console.log("Error when loading:" + e.message);
				console.log(className);
			}
		}
	};

```

