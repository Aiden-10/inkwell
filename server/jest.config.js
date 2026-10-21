export default {
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": [
            "babel-jest",
            {
                presets: [
                    ["@babel/preset-typescript", {
                        allowDeclareFields: true
                    }]
                ],
                babelrc: false,
                configFile: false,
            },
        ],
    },
    extensionsToTreatAsEsm: [".ts"],
};