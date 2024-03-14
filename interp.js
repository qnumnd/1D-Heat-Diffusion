function find_interval(point, intervals) {
    //If point is beyond given intervals
    if (point < intervals[0])
        return 0
    if (point > intervals[intervals.length - 1])
        return intervals.length - 1
    //If point is inside interval
    //Start searching on a full range of intervals
    var leftBorderIndex = 0
    var rightBorderIndex = intervals.length - 1
    //Reduce searching range till it find an interval point belongs to using binary search
    while (rightBorderIndex - leftBorderIndex !== 1) {
        var indexOfNumberToCompare = leftBorderIndex + Math.floor((rightBorderIndex - leftBorderIndex) / 2)
        point >= intervals[indexOfNumberToCompare]
            ? leftBorderIndex = indexOfNumberToCompare
            : rightBorderIndex = indexOfNumberToCompare
    }
    return leftBorderIndex
}

function find_interval_seq_down(point, intervals) {
    if (point > intervals[0])
        return 0
    if (point < intervals[intervals.length - 1])
        return intervals.length - 1
    for (let i = 0; i < intervals.length - 1; i++) {
        let leftPoint = intervals[i]
        let rightPoint = intervals[i + 1]
        if (leftPoint >= point && rightPoint <= point) return i
    }
    if (Math.abs(intervals[0] - point) < Math.abs(intervals[intervals.length - 1] - point)) return 0
    return intervals.length - 2
}

function lin_interp(x, x0, y0, x1, y1) {
    var a = (y1 - y0) / (x1 - x0)
    var b = -a * x0 + y0
    return a * x + b
}