declare const Call: any;
declare const Log: {
	debug(message:string);
	info(message:string);
	warn(message:string);
	err(message:string);
};
declare const Strings: {
	stripColors(string:string): string;
}
declare const Vars: any;
declare const Events: {
	on(event:any, handler:(e:any) => void);
}
declare const ServerLoadEvent: any;
declare const Menus: {
	registerMenu(listener:MenuListener):number;
}
declare const UnitTypes: {
	[index:string]: UnitType;
}
type UnitType = any;
declare const Sounds: {
	[index:string]: Sound;
}
type Sound = any;
declare const Blocks: {
	[index:string]: Block;
}
type Block = any;
declare const Team: {
	[index:string]: Team;
}
type Team = any;
declare const Groups: any;
type FishCommandArgType = string | number | FishPlayer | boolean | null;
type MenuListener = (player:mindustryPlayer, option:number) => void;
declare const Core: {
	settings: {
		get(key:string, defaultValue?:any):any;
		put(key:string, value:any):void;
		manualSave():void;
	}
	app: {
		post(func:() => unknown):void;
		exit():void;
	}
}
declare const SaveIO: {
	save(name:string):void;
}
declare const Timer: {
	schedule(func:() => unknown, delaySeconds:number, intervalSeconds?:number, repeatCount?:number);
}
declare const Time: {
	millis(): number;
}
type Tile = any;
declare const GameState: {
	State: Record<"playing" | "paused", any>;
}
interface FishCommandRunner {
	(_:{
		/**Raw arguments that were passed to the command. */
		rawArgs:(string | undefined)[];
		/**Formatted and parsed args. Access an argument by name, like python's keyword args. Example: `args.player.mod = true`. An argument can only be null if it was optional, otherwise the command will error before the handler runs. */
		args:Record<string, any>;//TODO maybe get this with an abominable conditional type?
		//having to manually cast the args is super annoying
		//but if I leave it as any it causes bugs
		/**The player who ran the command. */
		sender:FishPlayer;
		outputSuccess:(message:string) => void;
		outputFail:(message:string) => void;
		output:(message:string) => void;
		/**Executes a server console command. Be careful! */
		execServer:(message:string) => void;
	}): void;
}

interface FishCommandData {
	/**Args for this command, like ["player:player", "reason:string?"] */
	args: string[];
	description: string;
	/**Permission level required for players to run this command. If the player does not have this permission, the handler is not run and an error message is printed. */
	level: PermissionsLevel;
	/**Custom error message for unauthorized players. The default is `You do not have the required permission (mod) to execute this command`. */
	customUnauthorizedMessage?: string;
	handler: FishCommandRunner;
}
type FishCommandsList = Record<string, FishCommandData>;



interface FishPlayerData {
	name: string;
	muted: boolean;
	mod: boolean;
	admin: boolean;
	member: boolean;
	stopped: boolean;
	/*rank: Rank*/
	//TODO remove
	highlight: string | null;
	history: PlayerHistoryEntry[];
}

interface PlayerHistoryEntry {
	action:string;
	by:string;
	time:number;
}

/* mindustry.gen.Player */
type mindustryPlayer = any;
interface mindustryPlayerData {
	/**uuid */
	id: string;
	lastName: string;
	ips: Seq<string>;
	names: Seq<string>;
	adminUsid: string;
	timesKicked: number;
	timesJoined: number;
	admin: boolean;
	banned: boolean;
	lastKicked: number;
}

interface ClientCommandHandler {
	register(name:string, args:string, description:string, runner:(args:string[], player:mindustryPlayer) => void):void;
}

interface ServerCommandHandler {
	/**Executes a server console command. */
	handleMessage(command:string):void;
}

interface CommandArg {
	name: string;
	type: CommandArgType;
	isOptional: boolean;
}