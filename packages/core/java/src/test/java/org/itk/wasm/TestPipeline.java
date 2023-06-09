/*-
 * #%L
 * Java bindings for itk-wasm.
 * %%
 * Copyright (C) 2023 ITK developers.
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package org.itk.wasm;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledOnOs;
import org.junit.jupiter.api.condition.OS;

public class TestPipeline {

  private final Path test_data_dir;
  private final Path test_input_dir;
  private final Path test_baseline_dir;

  public TestPipeline() {
    test_data_dir = Paths.get("..", "test", "data").toAbsolutePath();
    test_input_dir = test_data_dir.resolve("input");
    test_baseline_dir = test_data_dir.resolve("baseline");
  }

  @Test
  public void testStdoutStderr() throws IOException {
   // Test logic goes here
    Pipeline pipeline = new Pipeline(test_input_dir.resolve("stdout-stderr-test.wasi.wasm").toString());
    pipeline.run(new ArrayList<>());

    // Test re-run
    pipeline.run(new ArrayList<>());
  }

  @Test
  public void test_pipeline_bytes() {
    // Test logic goes here
  }

  @Test
  public void test_pipeline_input_output_streams() {
    // Test logic goes here
  }

  @EnabledOnOs(OS.LINUX) // Skip this test on Windows platform
  @Test
  public void test_pipeline_input_output_files() {
    // Test logic goes here
  }

  @Test
  public void test_pipeline_write_read_image() {
    // Test logic goes here
  }

  @Test
  public void test_pipeline_write_read_mesh() {
    // Test logic goes here
  }

  @Test
  public void test_pipeline_write_read_polydata() {
    // Test logic goes here
  }
}
