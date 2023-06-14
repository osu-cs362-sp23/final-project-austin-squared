/**
 * @jest-environment jsdom
 */

require("@testing-library/jest-dom/extend-expect")
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default
jest.mock("../lib/generateChartImg", function () {
    return jest.fn().mockResolvedValue("http://placekitten.com/480/480")
})
const generateChartImg = require("../lib/generateChartImg")

const fs = require("fs")

function initDomFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.open()
    document.write(html)
    document.close()
    jest.isolateModules(function () {
        require(jsPath)
    })
}

test("add value button works and does not modify entered data", async function () {
    initDomFromFiles(
        __dirname + "/line.html",
        __dirname + "/line.js"
    )
    const xInput = domTesting.getByLabelText(document, "X")
    const yInput = domTesting.getByLabelText(document, "Y")
    const addValueButton = domTesting.queryByText(document, "+")
    const clearButton = domTesting.getByRole(document, 'button', { name: "Clear chart data" })

    const user = userEvent.setup()
    await user.type(xInput, "2")
    await user.type(yInput, "3")
    await user.click(addValueButton)

    const xEntries = domTesting.getAllByLabelText(document, "X")
    expect(xEntries.length).toBe(2)
    const yEntries = domTesting.getAllByLabelText(document, "Y")
    expect(yEntries.length).toBe(2)
    expect(xInput.value).toBe("2")
    expect(yInput.value).toBe("3")

    await user.click(clearButton)
})

test("alerts user for empty data fields (all fields empty)", async function () {
    initDomFromFiles(
        __dirname + "/line.html",
        __dirname + "/line.js"
    )
    const spy = jest.spyOn(window, "alert")
    spy.mockImplementation(function () { })
    const generateButton = domTesting.getByRole(document, 'button', { name: "Generate chart" })
    const clearButton = domTesting.getByRole(document, 'button', { name: "Clear chart data" })

    const user = userEvent.setup()
    await user.click(generateButton)

    expect(spy).toHaveBeenCalled()

    await user.click(clearButton)
})

test("alerts user for empty data fields (data but no axis labels)", async function () {
    initDomFromFiles(
        __dirname + "/line.html",
        __dirname + "/line.js"
    )
    const xInput = domTesting.getByLabelText(document, "X")
    const yInput = domTesting.getByLabelText(document, "Y")
    const spy = jest.spyOn(window, "alert")
    spy.mockImplementation(function () { })
    const generateButton = domTesting.getByRole(document, 'button', { name: "Generate chart" })
    const clearButton = domTesting.getByRole(document, 'button', { name: "Clear chart data" })

    const user = userEvent.setup()
    await user.type(xInput, "2")
    await user.type(yInput, "3")
    await user.click(generateButton)

    expect(spy).toHaveBeenCalled()
    spy.mockRestore()

    await user.click(clearButton)
})

test("alerts user for empty data fields (axis labels but no data)", async function () {
    initDomFromFiles(
        __dirname + "/line.html",
        __dirname + "/line.js"
    )
    const xLabelInput = domTesting.getByLabelText(document, "X label")
    const yLabelInput = domTesting.getByLabelText(document, "Y label")
    const spy = jest.spyOn(window, "alert")
    spy.mockImplementation(function () { })
    const generateButton = domTesting.getByRole(document, 'button', { name: "Generate chart" })
    const clearButton = domTesting.getByRole(document, 'button', { name: "Clear chart data" })

    const user = userEvent.setup()
    await user.type(xLabelInput, "xTest")
    await user.type(yLabelInput, "yTest")
    await user.click(generateButton)

    expect(spy).toHaveBeenCalled()
    spy.mockRestore()

    await user.click(clearButton)
})

test("clear chart data function resets elements correctly", async function () {
    initDomFromFiles(
        __dirname + "/line.html",
        __dirname + "/line.js"
    )
    const chartTitle = domTesting.getByLabelText(document, "Chart title")
    var xInput = domTesting.getByLabelText(document, "X")
    var yInput = domTesting.getByLabelText(document, "Y")
    const xLabelInput = domTesting.getByLabelText(document, "X label")
    const yLabelInput = domTesting.getByLabelText(document, "Y label")
    const colorPicker = domTesting.getByLabelText(document, "Chart color")

    const addValueButton = domTesting.queryByText(document, "+")
    const clearButton = domTesting.getByRole(document, 'button', { name: "Clear chart data" })

    const user = userEvent.setup()
    await user.type(chartTitle, "title")
    await user.type(xLabelInput, "xTest")
    await user.type(yLabelInput, "yTest")
    await user.type(xInput, "2")
    await user.type(yInput, "3")
    await user.click(addValueButton)
    await user.click(addValueButton)
    colorPicker.value = "#ffffff"
    var xEntries = domTesting.getAllByLabelText(document, "X")
    expect(xEntries.length).toBe(3)
    var yEntries = domTesting.getAllByLabelText(document, "Y")
    expect(yEntries.length).toBe(3)

    await user.click(clearButton)

    xEntries = domTesting.getAllByLabelText(document, "X")
    expect(xEntries.length).toBe(1)
    yEntries = domTesting.getAllByLabelText(document, "Y")
    expect(yEntries.length).toBe(1)
    expect(chartTitle.value).toBe("")
    xInput = domTesting.getByLabelText(document, "X")
    yInput = domTesting.getByLabelText(document, "Y")
    expect(xInput.value).toBe("")
    expect(yInput.value).toBe("")
    expect(xLabelInput.value).toBe("")
    expect(yLabelInput.value).toBe("")
    expect(colorPicker.value).toBe("#ff4500")

    await user.click(clearButton)
})

test("correctly sends data to generation function", async function () {
    initDomFromFiles(
        __dirname + "/line.html",
        __dirname + "/line.js"
    )
    const chartTitle = domTesting.getByLabelText(document, "Chart title")
    var xInput = domTesting.getByLabelText(document, "X")
    var yInput = domTesting.getByLabelText(document, "Y")
    const xLabelInput = domTesting.getByLabelText(document, "X label")
    const yLabelInput = domTesting.getByLabelText(document, "Y label")

    const clearButton = domTesting.getByRole(document, 'button', { name: "Clear chart data" })
    const generateButton = domTesting.getByRole(document, 'button', { name: "Generate chart" })

    const user = userEvent.setup()
    await user.type(chartTitle, "title")
    await user.type(xLabelInput, "xTest")
    await user.type(yLabelInput, "yTest")
    await user.type(xInput, "2")
    await user.type(yInput, "3")
    await user.click(generateButton)

    expect(generateChartImg).toHaveBeenCalled()

    await user.click(clearButton)
})
