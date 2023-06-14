const sort = require('./sortPoints')

test("test sorting two sets of data points", () => {
    expect(sort([{x: 2,y: 2}, {x: 1, y: 1}])).toStrictEqual([{x: 1,y: 1}, {x: 2, y: 2}])
})

test("test sorting five sets of data points", () => {
    expect(sort([{x: 5,y: 5}, {x: 2,y: 2}, {x: 3, y: 3}, {x: 1, y: 1}, {x: 4,y: 4}])).toStrictEqual([{x: 1,y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 4}, {x: 5, y: 5}])
})

test("test sorting five sets of data points with duplicate values", () => {
    expect(sort([{x: 5,y: 5}, {x: 2,y: 2}, {x: 5,y: 5}, {x: 1, y: 1}, {x: 1, y: 1}])).toStrictEqual([{x: 1,y: 1}, {x: 1,y: 1}, {x: 2,y: 2}, {x: 5, y: 5}, {x: 5, y: 5}])
}) 