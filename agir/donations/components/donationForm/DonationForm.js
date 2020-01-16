import { hot } from "react-hot-loader/root"; // doit être importé avant React
import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "@agir/lib/bootstrap/Button";

import { changeTotalAmount } from "./allocationsReducer";
import AllocationWidget from "./AllocationsWidget";
import AmountWidget from "./AmountWidget";
import TypeWidget from "./TypeWidget";

const DonationForm = ({
  initial,
  typeChoices,
  amountChoices,
  groupChoices,
  hiddenFields,
  minAmount,
  maxAmount,
  minAmountError,
  maxAmountError,
  showTaxCredit,
  byMonth
}) => {
  const [type, setType] = useState(initial.type || null);
  const [allocations, setAllocations] = useState(initial.allocations || {});
  const [amount, setAmount] = useState(initial.amount || null);

  const customError =
    amount === null
      ? null
      : minAmount && amount < minAmount
      ? minAmountError
      : maxAmount && amount > maxAmount
      ? maxAmountError
      : null;

  const valid =
    (!typeChoices || type !== null) && amount !== null && amount > 0;

  return (
    <form method="post" onSubmit={e => valid || e.preventDefault()}>
      {Object.keys(hiddenFields).map(k => (
        <input key={k} type="hidden" name={k} value={hiddenFields[k]} />
      ))}
      <input type="hidden" name="type" value={type || ""} />
      <input type="hidden" name="amount" value={amount || ""} />
      <input
        type="hidden"
        name="allocations"
        value={JSON.stringify(allocations.filter(a => a.amount !== 0))}
      />
      {typeChoices && (
        <TypeWidget
          type={type}
          typeChoices={typeChoices}
          onTypeChange={type => {
            setType(type);
          }}
        />
      )}
      <AmountWidget
        amount={amount}
        amountChoices={amountChoices}
        showTaxCredit={showTaxCredit}
        byMonth={byMonth}
        error={customError}
        onAmountChange={newAmount => {
          setAmount(newAmount);
          setAllocations(changeTotalAmount(allocations, amount, newAmount));
        }}
      />
      {groupChoices && groupChoices.length > 0 && (
        <AllocationWidget
          groupChoices={groupChoices}
          value={allocations}
          onChange={setAllocations}
          maxAmount={amount}
        />
      )}
      <div className="form-group">
        <div>
          <Button type="submit" bsStyle="primary">
            Je donne par carte bancaire !
          </Button>
        </div>
        <div>
          <small>
            Si vous souhaitez donner par chèque, merci de remplir et de joindre
            à votre chèque{" "}
            <a href="/static/donations/formulaire_dons_20190218.pdf">
              ce formulaire
            </a>
            .
          </small>
        </div>
      </div>
    </form>
  );
};
DonationForm.propTypes = {
  minAmount: PropTypes.number,
  maxAmount: PropTypes.number,
  minAmountError: PropTypes.string,
  maxAmountError: PropTypes.string,
  typeChoices: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    })
  ),
  amountChoices: PropTypes.arrayOf(PropTypes.number),
  showTaxCredit: PropTypes.bool,
  byMonth: PropTypes.bool,
  initial: PropTypes.object,
  groupChoices: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string
    })
  ),
  hiddenFields: PropTypes.objectOf(PropTypes.string)
};

export default hot(DonationForm);
