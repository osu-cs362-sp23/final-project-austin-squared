/**
 *  @jest-environment jsdom
 */

// require("whatwg-fetch")
const chartStorage = require('../lib/chartStorage')
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default
const initDomFromFiles = require("../../utils/initDomFromFiles")
require("@testing-library/jest-dom/extend-expect")
// const rest = require("msw").rest
// const setupServer = require("msw/node").setupServer

// test("A chart is saved when '+' is clicked", async () => {
//     initDomFromFiles(
//         __dirname + "/../scatter/scatter.html",
//         __dirname + "/../scatter/scatter.js"
//     )

//     const user = userEvent.setup()
    
  
//     const saveChartButton = domTesting.getAllByRole(document, "button", {name: "Save chart"})
//     const chartTitle = domTesting.getByLabelText(document, "Chart title")
//     const xlabel = domTesting.getByLabelText(document, "X label")
//     const ylabel = domTesting.getByLabelText(document, "Y label")
//     const xinput1 = domTesting.getByLabelText(document, "X")
//     const yinput1 = domTesting.getByLabelText(document, "Y")

//     await user.type(chartTitle, "People vs. Dogs")
//     await user.type(xlabel, "People")
//     await user.type(ylabel, "Dogs")
//     await user.type(xinput1, "1")
//     await user.type(yinput1, "1")

//     await user.click(saveChartButton)

//     console.log(chartStorage.loadSavedChart(0))
//     expect(chartStorage.saveChart({type: "scatter", data: [{x: 1,y: 1}], xLabel: "People", yLabel: "Dogs"})).toBe(chartStorage.loadSavedChart(0))
// })

test("saveChart saves a chart object & loadAllSavedCharts returns an array with the chart object saved", () => {
    const chart = {type: "scatter", data: [{x: 1,y: 1}], xLabel: "People", yLabel: "Dogs"}
    chartStorage.saveChart(chart,0)
    const size = chartStorage.loadAllSavedCharts()
    expect(size).toHaveLength(1)
})

test("loadSavedChart correctly loads a chart object", () => {
    const chart = {type: "scatter", data: [{x: 1,y: 1}], xLabel: "People", yLabel: "Dogs"}
    chartStorage.saveChart(chart,0)
    const loadedChart = chartStorage.loadSavedChart(0)
    expect(loadedChart).toStrictEqual(chart)
})

test("updateCurrentChartData operates correctly", () => {
    const chart = {type: "scatter", data: [{x: 1,y: 1}], xLabel: "People", yLabel: "Dogs"}
    chartStorage.updateCurrentChartData(chart)
    const loadedChart = JSON.parse(window.localStorage.getItem("currentChartData"))
    expect(loadedChart).toStrictEqual(chart)
})

test("loadChartData operates correctly", () => {
    window.localStorage.clear()
    const chart = {type: "scatter", data: [{x: 1,y: 1}], xLabel: "People", yLabel: "Dogs"}
    chartStorage.updateCurrentChartData(chart)
    const loadedChart = chartStorage.loadCurrentChartData()
    expect(loadedChart).toStrictEqual(chart)
})