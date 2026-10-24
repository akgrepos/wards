// Prints the text found in a screenshot, one line per piece, with its position as "x y text"
// (x, y = centre of the text as a fraction of the image width and height, y measured from the top).
// Used by scripts/sim-check.mjs: `swift scripts/lib/ocr.swift <png>`. macOS only (Apple's Vision framework).
import Foundation
import Vision
import AppKit

guard CommandLine.arguments.count > 1,
      let image = NSImage(contentsOfFile: CommandLine.arguments[1]),
      let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
  FileHandle.standardError.write("Usage: ocr.swift <png>\n".data(using: .utf8)!)
  exit(1)
}
let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.usesLanguageCorrection = false
try VNImageRequestHandler(cgImage: cg, options: [:]).perform([request])
for obs in request.results ?? [] {
  guard let top = obs.topCandidates(1).first else { continue }
  let b = obs.boundingBox
  print(String(format: "%.3f %.3f %@", b.midX, 1 - b.midY, top.string))
}
