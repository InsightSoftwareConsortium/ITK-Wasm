import { test, expect } from "@playwright/test";

const expectedCompressedOutput = new Uint8Array([
  100, 97, 116, 97, 58, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47,
  105, 119, 105, 43, 99, 98, 111, 114, 43, 122, 115, 116, 100, 59, 98, 97, 115,
  101, 54, 52, 44, 75, 76, 85, 118, 47, 83, 65, 69, 73, 81, 65, 65, 51, 113, 50,
  43, 55, 119, 61, 61,
]);
const expectedDecompressedOutput = new Uint8Array([222, 173, 190, 239]);
const compressionOptions = {
  stringify: true,
  compressionLevel: 5,
  dataUrlPrefix: "data:application/iwi+cbor+zstd;base64,",
};

test.describe("@itk-wasm/compress-stringify", () => {
  test("compressStringify runs sample inputs and produces expected outputs", async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .locator('#compressStringifyInputs sl-button[name="loadSampleInputs"]')
      .click();
    await expect(
      page.locator("#compressStringify-input-details")
    ).toContainText("222,173,190,239");

    // Check the value of the Shoelace input component
    const dataUrlPrefixValue = await page
      .locator('#compressStringifyInputs sl-input[name="data-url-prefix"]')
      .evaluate((el: any) => el.value);
    expect(dataUrlPrefixValue).toBe("data:application/iwi+cbor+zstd;base64,");

    await page
      .locator('#compressStringifyInputs sl-button[name="run"]')
      .click();

    await expect(
      page.locator("#compressStringify-output-details")
    ).toContainText(expectedCompressedOutput.toString());
  });

  test("parseStringDecompress runs sample inputs and produces expected outputs", async ({
    page,
  }) => {
    await page.goto("/");

    await page.locator('sl-tab[panel="parseStringDecompress-panel"]').click();

    await page
      .locator(
        '#parseStringDecompressInputs sl-button[name="loadSampleInputs"]'
      )
      .click();

    await page
      .locator('#parseStringDecompressInputs sl-button[name="run"]')
      .click();

    await expect(
      page.locator("#parseStringDecompress-output-details")
    ).toContainText(expectedDecompressedOutput.toString());
  });

  test("compresses with the default API", async ({ page }) => {
    await page.goto("/");

    const result = (await page.evaluate(async (options) => {
      const { output } = await window.compressStringify.compressStringify(
        new Uint8Array([222, 173, 190, 239]),
        options
      );
      return Array.from(output);
    }, compressionOptions)) as number[];

    expect(new Uint8Array(result)).toEqual(expectedCompressedOutput);
  });

  test("compresses after terminating the web worker", async ({ page }) => {
    await page.goto("/");

    const result = (await page.evaluate(async (options) => {
      const { output, webWorker } =
        await window.compressStringify.compressStringify(
          new Uint8Array([222, 173, 190, 239]),
          options
        );

      const firstOutput = Array.from(output);
      webWorker.terminate();

      const { output: outputNew } =
        await window.compressStringify.compressStringify(
          new Uint8Array([222, 173, 190, 239]),
          options
        );

      return {
        firstOutput,
        secondOutput: Array.from(outputNew),
      };
    }, compressionOptions)) as {
      firstOutput: number[];
      secondOutput: number[];
    };

    expect(new Uint8Array(result.firstOutput)).toEqual(
      expectedCompressedOutput
    );
    expect(new Uint8Array(result.secondOutput)).toEqual(
      expectedCompressedOutput
    );
  });

  test("compresses inputs twice without explicit copy", async ({ page }) => {
    await page.goto("/");

    const result = (await page.evaluate(async (options) => {
      const inputData = new Uint8Array([222, 173, 190, 239]);
      const { output, webWorker } =
        await window.compressStringify.compressStringify(inputData, options);

      const firstOutput = Array.from(output);
      webWorker.terminate();

      const { output: outputNew } =
        await window.compressStringify.compressStringify(inputData, options);

      return {
        firstOutput,
        secondOutput: Array.from(outputNew),
      };
    }, compressionOptions)) as {
      firstOutput: number[];
      secondOutput: number[];
    };

    expect(new Uint8Array(result.firstOutput)).toEqual(
      expectedCompressedOutput
    );
    expect(new Uint8Array(result.secondOutput)).toEqual(
      expectedCompressedOutput
    );
  });

  test("compresses with a null webWorker option", async ({ page }) => {
    await page.goto("/");

    const result = (await page.evaluate(async (options) => {
      const optionsWithNullWorker = { ...options, webWorker: null };
      const inputData = new Uint8Array([222, 173, 190, 239]);

      const { output, webWorker } =
        await window.compressStringify.compressStringify(
          inputData,
          optionsWithNullWorker
        );

      const firstOutput = Array.from(output);
      webWorker.terminate();

      const { output: outputNew } =
        await window.compressStringify.compressStringify(
          inputData,
          optionsWithNullWorker
        );

      return {
        firstOutput,
        secondOutput: Array.from(outputNew),
      };
    }, compressionOptions)) as {
      firstOutput: number[];
      secondOutput: number[];
    };

    expect(new Uint8Array(result.firstOutput)).toEqual(
      expectedCompressedOutput
    );
    expect(new Uint8Array(result.secondOutput)).toEqual(
      expectedCompressedOutput
    );
  });
});
