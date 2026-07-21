import test from 'ava'
import path from 'path'

import { gdcmReadImageNode, gdcmWriteImageNode } from '../../dist/index-node.js'

import { testInputPath, testOutputPath } from './common.js'

// Authoritative regression test for issue #1470: itk::GDCMImageIO regenerates the
// StudyInstanceUID (0020|000d) and SeriesInstanceUID (0020|000e) on write unless
// KeepOriginalUID is set. The fix in write-image.cxx enables SetKeepOriginalUID(true)
// when the input metadata already carries these tags. This test reads a DICOM with
// known Study/Series UIDs, writes it back through the fixed gdcm-write wasm, reads it
// again, and asserts the UIDs are byte-for-byte identical across the round-trip.
// Refs: https://github.com/InsightSoftwareConsortium/ITK-Wasm/issues/1470

const testInputFilePath = path.join(
  testInputPath,
  '1.3.6.1.4.1.5962.99.1.3814087073.479799962.1489872804257.100.0.dcm'
)
const testOutputFilePath = path.join(testOutputPath, 'gdcm-preserve-uid.dcm')

const studyInstanceUIDTag = '0020|000d'
const seriesInstanceUIDTag = '0020|000e'

// Valid, all-numeric sentinel UIDs used only if the sample happens not to carry the
// tags. The DICOM UI value representation allows digits and dots only (no letters), so
// these must stay numeric or GDCM would reject/regenerate them and defeat the fallback.
const sentinelStudyUID = '1.2.826.0.1.3680043.9.7.1470.1'
const sentinelSeriesUID = '1.2.826.0.1.3680043.9.7.1470.2'

test('Preserves Study/Series Instance UIDs across a DICOM write->read round-trip', async t => {
  const { couldRead, image } = await gdcmReadImageNode(testInputFilePath)
  t.true(couldRead, 'could read the input DICOM')

  // Capture the UIDs carried by the source image metadata (image.metadata is a Map).
  let originalStudyUid = image.metadata.get(studyInstanceUIDTag)
  let originalSeriesUid = image.metadata.get(seriesInstanceUIDTag)

  // Defensive fallback guarding the test's premise: preservation can only be exercised
  // if there is a UID to preserve. If (and only if) the sample lacks a tag, set a known
  // sentinel on the metadata Map before writing so the write still triggers the fix
  // (which keys off the presence of 0020|000d / 0020|000e in the input metadata).
  let usedSentinelStudy = false
  let usedSentinelSeries = false
  if (!originalStudyUid) {
    originalStudyUid = sentinelStudyUID
    image.metadata.set(studyInstanceUIDTag, originalStudyUid)
    usedSentinelStudy = true
  }
  if (!originalSeriesUid) {
    originalSeriesUid = sentinelSeriesUID
    image.metadata.set(seriesInstanceUIDTag, originalSeriesUid)
    usedSentinelSeries = true
  }
  if (usedSentinelStudy || usedSentinelSeries) {
    t.log(
      `Sample lacked a UID tag; used sentinel value(s): study=${usedSentinelStudy}, series=${usedSentinelSeries}`
    )
  }

  // The premise: we must have non-empty UIDs to preserve (from the sample or the fallback).
  t.truthy(originalStudyUid, 'a StudyInstanceUID (0020|000d) is present to preserve')
  t.truthy(originalSeriesUid, 'a SeriesInstanceUID (0020|000e) is present to preserve')

  // Write the image back out through the fixed gdcm-write wasm (uncompressed).
  const useCompression = false
  const { couldWrite } = await gdcmWriteImageNode(image, testOutputFilePath, { useCompression })
  t.true(couldWrite, 'could write the DICOM')

  // Read the freshly written file back.
  const { couldRead: couldReadBack, image: imageBack } = await gdcmReadImageNode(testOutputFilePath)
  t.true(couldReadBack, 'could read the written DICOM back')

  // Core assertions: the UIDs must survive the round-trip byte-for-byte. A mismatch means
  // GDCM regenerated the UID on write instead of preserving it (the pre-fix bug, #1470).
  t.is(
    imageBack.metadata.get(studyInstanceUIDTag),
    originalStudyUid,
    'StudyInstanceUID (0020|000d) changed on write — GDCM regenerated it instead of preserving the original (regression of the issue #1470 fix)'
  )
  t.is(
    imageBack.metadata.get(seriesInstanceUIDTag),
    originalSeriesUid,
    'SeriesInstanceUID (0020|000e) changed on write — GDCM regenerated it instead of preserving the original (regression of the issue #1470 fix)'
  )
})
