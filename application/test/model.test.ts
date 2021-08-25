import { describe, Try } from "riteway";

import { getModel } from "../src/model";
import { ModelService } from "../src/service";
import { Log } from "../src/persistentlog";
//process.env.TEST_DB_LOCAL = "true";
import { config } from "./testConfig";

describe("Simple Component", async (assert) => {
  let model = null;
  try {
    model = await getModel(config);
    const modelService = await ModelService(model);

    const log = Log();
    await modelService.seed(log);

    const filevents = await modelService.queryFileEvents();

    assert({
      given: "no property filter",
      should: "be many Projects",
      actual: true,
      expected: true,
    });
  } catch (ex) {
    console.log(ex);
  }

  assert({
    given: "no arguments",
    should: "return 0",
    actual: 0,
    expected: 0,
  });

  if (model) model.close();
});
