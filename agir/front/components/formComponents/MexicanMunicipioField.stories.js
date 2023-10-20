import { rest } from "msw";
import React, { useState } from "react";

import MexicanMunicipioField, {
  SEARCH_ENDPOINT_URL,
} from "./MexicanMunicipioField";
import TEST_DATA from "@agir/front/mockData/mexicanMunicipios";

export default {
  component: MexicanMunicipioField,
  title: "Form/MexicanMunicipioField",
  parameters: {
    layout: "padded",
    msw: {
      handlers: [
        rest.get(SEARCH_ENDPOINT_URL, (req, res, ctx) => {
          const search = req.url.searchParams.get("q");
          return res(
            ctx.json(
              TEST_DATA.filter((o) =>
                new RegExp(search, "gi").test(JSON.stringify(Object.values(o))),
              ),
            ),
          );
        }),
      ],
    },
  },
};

const Template = (args) => {
  const [value, setValue] = useState(args.value);
  return (
    <>
      <MexicanMunicipioField {...args} value={value} onChange={setValue} />
      <pre>Value: {value ? JSON.stringify(value, undefined, "  ") : "—"}</pre>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  id: "municipio",
  name: "municipio",
  label: "Municipalidad de origen",
  helpText: "Busca empiezando por un 'C'",
  error: "",
};

export const Filled = Template.bind({});
Filled.args = {
  ...Default.args,
  initialValue: TEST_DATA[85],
};
