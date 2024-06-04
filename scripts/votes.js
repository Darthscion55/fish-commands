"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteManager = void 0;
//le overhaul
var players_1 = require("./players");
var VoteManager = /** @class */ (function () {
    function VoteManager(onSuccess, onFail, onVote, onUnVote, voteTime, goal) {
        if (goal === void 0) { goal = 0.50001; }
        var _this = this;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.onVote = onVote;
        this.onUnVote = onUnVote;
        this.voteTime = voteTime;
        this.goal = goal;
        this.votes = new Map();
        this.timer = null;
        this.active = false;
        Events.on(EventType.PlayerLeave, function (_a) {
            var player = _a.player;
            //Run once the player has been removed
            return Core.app.post(function () { return _this.unvote(player); });
        });
        Events.on(EventType.GameOverEvent, function () { return _this.resetVote(); });
    } //TODO:PR use builder pattern to clarify call site
    VoteManager.prototype.start = function (player, value) {
        var _this = this;
        this.active = true;
        this.timer = Timer.schedule(function () { return _this.endVote(); }, this.voteTime / 1000);
        this.vote(player, value);
    };
    VoteManager.prototype.vote = function (player, value) {
        if (!this.active)
            return this.start(player, value);
        this.votes.set(player.uuid, value);
        Log.info("Player voted, Name : ".concat(player.name, ",UUID : ").concat(player.uuid));
        this.onVote(player);
        this.checkVote();
    };
    VoteManager.prototype.unvote = function (player) {
        if (!this.active)
            return;
        var fishP = players_1.FishPlayer.resolve(player);
        if (!this.votes.delete(fishP.uuid))
            Log.err("Cannot remove nonexistent vote for player with uuid ".concat(fishP.uuid));
        this.onUnVote(fishP);
        this.checkVote();
    };
    VoteManager.prototype.forceVote = function (force) {
        if (!this.active)
            return;
        if (force)
            this.succeeded();
        else
            this.failed();
    };
    VoteManager.prototype.failed = function () {
        this.onFail();
        this.resetVote();
    };
    VoteManager.prototype.succeeded = function () {
        this.onSuccess();
        this.resetVote();
    };
    VoteManager.prototype.resetVote = function () {
        if (this.timer != null)
            this.timer.cancel();
        this.votes.clear();
        this.active = false;
    };
    VoteManager.prototype.getGoal = function () {
        //TODO discount AFK players
        return Math.ceil(this.goal * Groups.player.size());
    };
    VoteManager.prototype.scoreVotes = function () {
        return __spreadArray([], __read(this.votes), false).reduce(function (acc, _a) {
            var _b = __read(_a, 2), k = _b[0], v = _b[1];
            return acc + v;
        }, 0);
    };
    VoteManager.prototype.checkVote = function () {
        if (this.scoreVotes() >= this.getGoal()) {
            this.succeeded();
        }
    };
    VoteManager.prototype.endVote = function () {
        if (this.scoreVotes() >= this.getGoal()) {
            this.succeeded();
        }
        else {
            this.failed();
        }
    };
    return VoteManager;
}());
exports.VoteManager = VoteManager;
