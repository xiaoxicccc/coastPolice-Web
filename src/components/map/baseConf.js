/* eslint-disable */
let png360data = () => {
    return {
        data1: {
            "header": {
                "la1": 90,
                "la2": -90,
                "lo1": -180,
                "lo2": 179,
                "extent": [
                    -180,
                    -90,
                    179,
                    90
                ],
                "nx": 360,
                "ny": 179,
                "dx": 1,
                "dy": 1,
                "min": -20,
                "max": 20,
                parameterCategory: 1,
                parameterNumber: 2,
            },
            "data": []
        },
        data2: {
            "header": {
                "la1": 90,
                "la2": -90,
                "lo1": -180,
                "lo2": 179,
                "extent": [
                    -180,
                    -90,
                    179,
                    90
                ],
                "nx": 360,
                "ny": 179,
                "dx": 1,
                "dy": 1,
                "min": 20,
                "max": 20,
                parameterCategory: 1,
                parameterNumber: 3,
            },
            "data": []
        }
    }
}

let velocityScales = () => {
    return {
        0: 1 / 20,
        1: 1 / 20,
        2: 1 / 20,
        3: 1 / 30,
        4: 1 / 40,
        5: 1 / 50,
        6: 1 / 60,
        7: 0.003,
        8: 0.002,
        9: 0.001,
        10: 0.0005,
        11: 0.0003,
        12: 0.00015,
        13: 0.0001,
        14: 0.00005,
        15: 0.000025,
        16: 0.00001,
        17: 0.000005,
        18: 0.000002,
        19: 0.000001,
        20: 0.0000005,
        21: 0.0000002,
        22: 0.0000001,
    }
}

let colorScale = () => {
    return [
        "rgb(36,104, 180)",
        "rgb(60,157, 194)",
        "rgb(128,205,193 )",
        "rgb(151,218,168 )",
        "rgb(198,231,181)",
        "rgb(238,247,217)",
        "rgb(255,238,159)",
        "rgb(252,217,125)",
        "rgb(255,182,100)",
        "rgb(252,150,75)",
        "rgb(250,112,52)",
        "rgb(245,64,32)",
        "rgb(237,45,28)",
        "rgb(220,24,32)",
        "rgb(180,0,35)"
    ]
}

export { png360data, velocityScales, colorScale }
