// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "MarC",
    platforms: [
        .macOS(.v14)
    ],
    products: [
        .library(name: "MarCCore", targets: ["MarCCore"]),
        .executable(name: "MarC", targets: ["MarC"]),
        .executable(name: "MarCChecks", targets: ["MarCChecks"])
    ],
    targets: [
        .target(
            name: "MarCCore",
            path: "Sources/MarCCore"
        ),
        .executableTarget(
            name: "MarC",
            dependencies: ["MarCCore"],
            path: "Sources/MarC"
        ),
        .executableTarget(
            name: "MarCChecks",
            dependencies: ["MarCCore"],
            path: "Tests/MarCChecks"
        )
    ]
)
