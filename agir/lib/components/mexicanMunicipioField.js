import onDOMReady from "@agir/lib/utils/onDOMReady";
import { renderReactComponent } from "@agir/lib/utils/react";
import React, { useState } from "react";

import MexicanMunicipioField from "@agir/front/formComponents/MexicanMunicipioField";
import ThemeProvider from "@agir/front/theme/ThemeProvider";

const Field = (props) => {
  const [value, setValue] = useState();

  return (
    <ThemeProvider>
      <MexicanMunicipioField {...props} value={value} onChange={setValue} />
    </ThemeProvider>
  );
};

const renderField = (originalField) => {
  const parent = originalField.parentNode;
  const renderingNode = document.createElement("div");
  const helpText = parent.querySelector("[id^='hint']")?.innerText;
  const error = parent.querySelector("[id^='error']")?.innerText;

  let initialValue = null;
  try {
    initialValue = JSON.parse(originalField.value);
  } catch (e) {
    initialValue = null;
  }

  renderReactComponent(
    <Field
      {...originalField.dataset}
      id={originalField.id}
      name={originalField.name}
      initialValue={initialValue}
      required={originalField.required}
      disabled={originalField.disabled}
      readOnly={originalField.readOnly}
      error={error}
      helpText={helpText}
    />,
    renderingNode,
  );

  parent.classList.remove("progress");
  parent.removeChild(originalField);
  parent.appendChild(renderingNode, parent);
};

onDOMReady(() => {
  document
    .querySelectorAll('input[data-component="MexicanMunicipioField"]')
    .forEach(renderField);
});
