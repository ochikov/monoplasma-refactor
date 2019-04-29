const assert = require("assert")

const {
    assertEqual,
    assertEvent,
    assertEventBySignature,
    assertFails,
} = require("../utils/web3Assert")

const {
    until,
    untilStreamContains,
} = require("../utils/await-until")

const EventEmitter = require("events")
const sleep = require("../utils/sleep-promise")

// simulate what Truffle provides
const Web3 = require("web3")
global.web3 = Web3.utils
global.assert = require("assert")

describe("Test help utilities", () => {
    describe("assertEqual", () => {
        it("matches numbers", () => {
            assertEqual(1, "1")
            assert.throws(() => assertEqual(1, 2), "expected 1 to equal 2")
        })
        it("matches strings", () => {
            assertEqual("0x74657374", "test")
            assertEqual("0x74657374746573747465737474657374", "testtesttesttest")
            assert.throws(() => assertEqual("0x74657374", "jest"), "expected 'test' to equal 'jest'")
        })
        it("won't convert response to string if address is expected", () => {
            assertEqual("0x7465737474657374746573747465737474657374", "0x7465737474657374746573747465737474657374")
            assertEqual("0x7465737474657374746573747465737474657374", "testtesttesttesttest")
        })
    })

    describe("assertEvent", () => {
    // TODO: real truffle responses please
        it("finds the wanted event and checks args", () => {
            assertEvent({
                logs: [{
                    event: "testEvent",
                    args: {
                        arg1: "moo",
                        arg2: "foo",
                        arg3: "scoo",
                    },
                }],
            }, "testEvent", {
                arg1: "moo",
                arg2: "foo",
            })
        })
        it("throws if arg is missing", () => {
            assert.throws(() => assertEvent({
                logs: [{
                    event: "testEvent",
                    args: {
                        arg1: "moo",
                        arg3: "scoo",
                    },
                }],
            }, "testEvent", {
                arg1: "moo",
                arg2: "foo",
            }), Error)
        })
        it("throws if event is missing", () => {
            assert.throws(() => assertEvent({
                logs: [{
                    event: "anotherEvent",
                    args: {
                        arg1: "moo",
                        arg3: "scoo",
                    },
                }],
            }, "testEvent", {
                arg1: "moo",
            }), Error)
        })
        it("works without args", () => {
            assertEvent({
                logs: [{
                    event: "testEvent",
                    args: {
                        arg1: "moo",
                        arg3: "scoo",
                    },
                }],
            }, "testEvent")
        })
    })

    describe("assertEventBySignature", () => {
        it("finds the wanted event", () => {
            assertEventBySignature({ receipt: { logs: [{ topics: ["0x24ec1d3ff24c2f6ff210738839dbc339cd45a5294d85c79361016243157aae7b", "argument", "hashes"] }] }}, "TestEvent()")
        })
        it("throws if signature is missing", () => {
            assert.throws(() => assertEventBySignature({ logs: [{ topics: ["0x24ec1d3ff24c2f6ff210738839dbc339cd45a5294d85c79361016243157aae7c", "argument", "hashes"] }] }, "TestEvent()"), Error)
        })
    })

    describe("assertFails", () => {
        it("fails when it should", async () => {
            await assertFails(Promise.reject(new Error("boo!")))
            try {
                await assertFails(Promise.resolve("done!"))
                throw new Error("should fail!")
            } catch (e) {
            // all good
            }
        })
    })

    describe("await-until", () => {
        it("waits until condition is true", async () => {
            const start = +new Date()
            let done = false
            setTimeout(() => { done = true }, 10)
            assert(!done)
            assert(+new Date() - start < 9)
            const ret = await until(() => done)
            assert(done)
            assert(ret)
            assert(+new Date() - start > 9)
            assert(+new Date() - start < 900)
        })
        it("waits until timeout", async () => {
            const start = +new Date()
            let done = false
            assert(!done)
            assert(+new Date() - start < 9)
            const ret = await until(() => done, 100, 10)
            assert(!done)
            assert(!ret)
            assert(+new Date() - start > 90)
            assert(+new Date() - start < 900)
        })
        it("untilStreamContains", async () => {
            const stream = new EventEmitter()
            let done = false
            untilStreamContains(stream, "DONE").then(() => {
                done = true
            })
            await sleep(1)
            assert(!done)
            stream.emit("data", "test")
            await sleep(1)
            assert(!done)
            stream.emit("data", "lol DONE")
            await sleep(1)
            assert(done)
            stream.emit("data", "test again")
            await sleep(1)
            assert(done)
        })
    })
})
