var Utils = function() {

    var shuffle = function(arr) {
        let currIdx = arr.length;
        let swapIdx;
        let temp;
        while (currIdx > 0) {
            currIdx--;
            swapIdx = Math.floor(Math.random()*currIdx);
            temp = arr[currIdx];
            arr[currIdx] = arr[swapIdx];
            arr[swapIdx] = temp;
        }
        return arr;
    }

    return {
        shuffle : shuffle
    };
}

module.exports = Utils;