require("whatwg-fetch")
const generateChartImg = require("./generateChartImg")
const fs = require('fs')
const path = require('path')
require("@testing-library/jest-dom/extend-expect")
const rest = require("msw").rest
const setupServer = require("msw/node").setupServer

const filePath = path.resolve(__dirname, 'image.PNG')

jest.mock('node-fetch');



const server = setupServer(
    rest.post("https://quickchart.io/chart", (req, res, ctx) => {
        console.log("== Fake API Called")
        const png = fs.readFileSync(filePath)
        return res(
            ctx.body(png),
            ctx.set('Content-Type', 'image/png'))
    })
)

beforeAll(() => {
    server.listen()
})

afterEach(() => {
    server.resetHandlers()
})

afterAll(() => {
    server.close()
})

test("generateChartImg correctly functions", async () => {

    const imgURL = await generateChartImg("scatter", 
                                         [{x: 1,y: 1}, {x: 2,y: 4}, {x: 3,y: 6}], 
                                         "People", "Dogs", "People vs. Dogs")
    console.log(imgURL)
    expect(imgURL).toContain("blob:")
})

