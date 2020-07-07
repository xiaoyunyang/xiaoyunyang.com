import React, { useState } from "react";
import { PageProps, Link } from "gatsby";
import NumberFormat from "react-number-format";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";

// Libs
import { clone } from "ramda";
import SEO from "../components/seo";
import Layout from "../components/layout";
import DollarInput from "../lib/dollarInput";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  tableInput: {
    width: 100
  }
});
const rowLabels = [
  "startAsset",
  "asking",
  "offer",
  "downPaymentPct",
  "downPaymentDollar",
  "closing",
  "moneyLeft",
  "loanAmount",
  "interestRate",
  "monthlyLoan",
  "maintenance",
  "monthly",
  "postClosingAsset"
];
const rowLabelDataFormat = {
  name: "string",
  startAsset: "adjustableDollar",
  asking: "dollar",
  offer: "adjustableDollar",
  downPaymentPct: "adjustablePercent",
  downPaymentDollar: "dollar",
  closing: "dollar",
  moneyLeft: "dollar",
  loanAmount: "dollar",
  interestRate: "adjustablePercent",
  monthlyLoan: "dollar",
  maintenance: "dollar",
  monthly: "dollar",
  postClosingAsset: "wholeNumber"
};
const createNewEntry = ({
  name, startAsset, asking, offer, downPaymentPct, closing, interestRate, maintenance
}: {
  name: string,
  startAsset: number,
  asking: number,
  offer: number,
  downPaymentPct: number,
  closing: number,
  interestRate: number,
  maintenance: number
}) => {
  const downPaymentDollar = downPaymentPct * 0.01 * offer;
  const moneyLeft = startAsset - downPaymentDollar - closing;
  const loanAmount = offer - downPaymentDollar;
  const mir = (interestRate / 100) / 12; // monthly interest rate
  const monthlyLoan = (loanAmount * mir * (1 + mir) ** (12 * (30))) / ((1 + mir) ** (12 * 30) - 1);
  const monthly = maintenance + monthlyLoan;
  const postClosingAsset = moneyLeft / monthly;
  return {
    name,
    startAsset,
    asking,
    offer,
    downPaymentPct,
    downPaymentDollar,
    closing,
    moneyLeft,
    loanAmount,
    interestRate,
    monthlyLoan,
    maintenance,
    monthly,
    postClosingAsset
  };
};

const AddNewColumn = () => {
  const classes = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1)
    }
  }));

  return (
    <Fab size="small" color="secondary" aria-label="add" className={classes.margin}>
      <AddIcon />
    </Fab>
  );
};

const tableInit = {
  name: [""],
  startAsset: ["Start Asset"],
  asking: ["Asking Price"],
  offer: ["Offer"],
  downPaymentPct: ["Down Payment (percent)"],
  downPaymentDollar: ["Down Payment (dollars)"],
  closing: ["Closing"],
  moneyLeft: ["Money Left"],
  loanAmount: ["Loan Amount"],
  interestRate: ["Interest Rate (annual)"],
  monthlyLoan: ["Monthly Loan Payment"],
  maintenance: ["Maintenance"],
  monthly: ["Monthly (Loan + Maint)"],
  postClosingAsset: ["Post closing reserve (months)"]
};
const createTable = () => {
  const newCol = createNewEntry({
    name: "115 East 9th St 4-M",
    startAsset: 150000,
    asking: 565000,
    offer: 545000,
    downPaymentPct: 25,
    closing: 10000,
    interestRate: 3.25,
    maintenance: 574
  });
  const newCol2 = createNewEntry({
    name: "88 3rd St 11",
    startAsset: 150000,
    asking: 420000,
    offer: 420000,
    downPaymentPct: 20,
    closing: 10000,
    interestRate: 3.25,
    maintenance: 568
  });
  const newCol3 = createNewEntry({
    name: "88 Bleecker St 6B",
    startAsset: 150000,
    asking: 475000,
    offer: 455000,
    downPaymentPct: 25,
    closing: 10000,
    interestRate: 3.25,
    maintenance: 1073
  });
  const cols = [newCol, newCol2, newCol3];
  const table = clone(tableInit);
  const keys = [...rowLabels, "name"];
  for (let i = 0; i < cols.length; i += 1) {
    const col = cols[i];
    for (let j = 0; j < keys.length; j += 1) {
      const key = keys[j];
      table[key].push(col[key]);
    }
  }
  return table;
};

const TableEntry = (
  {
    value, i, rowLabel, isLabel, setTableEntry
  }:
  {
    value: string | number;
    i: number;
    rowLabel: string;
    isLabel: boolean;
    setTableEntry: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}
) => {
  const classes = useStyles();
  if (isLabel) return <>{value}</>;
  const dataFormat = rowLabelDataFormat[rowLabel];
  switch (dataFormat) {
  case "adjustablePercent":
    return (
      <Input
        id={`${rowLabel}-${i}`}
        className={classes.tableInput}
        inputProps={{
          style: { textAlign: "right" }
        }}
        value={value}
        onChange={setTableEntry(rowLabel, i)}
        endAdornment={<InputAdornment position="end">%</InputAdornment>}
      />
    );
  case "adjustableDollar":
    return (
      <DollarInput
        id={`${rowLabel}-${i}`}
        className={classes.tableInput}
        value={value}
        onChange={setTableEntry(rowLabel, i)}
      />
    );
  case "percent":
    return <NumberFormat value={value} displayType="text" thousandSeparator suffix="%" decimalScale={3} />;
  case "wholeNumber":
    return <NumberFormat value={value} displayType="text" thousandSeparator decimalScale={0} />;
  case "dollar":
    return <NumberFormat value={value} displayType="text" thousandSeparator prefix="$" decimalScale={0} />;
  case "string":
    return <>{value}</>;
  default:
    return <>{value}</>;
  }
};
const getColEntry = (table, i, entryUpdate) => {
  const newColArgs = {
    name: table.name[i],
    startAsset: table.startAsset[i],
    asking: table.asking[i],
    offer: table.offer[i],
    downPaymentPct: table.downPaymentPct[i],
    closing: table.closing[i],
    interestRate: table.interestRate[i],
    maintenance: table.maintenance[i],
    ...entryUpdate
  };
  const newCol = createNewEntry(newColArgs);
  return newCol;
};
const CalcTable = () => {
  const classes = useStyles();

  const [table, setTable] = useState(createTable());

  const setTableEntry = (rowLabel: string, i: number) => (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newValue = Number(e.target.value);
    if (Number.isNaN(Number(newValue))) return;
    const newTable = clone(table);
    newTable[rowLabel][i] = newValue;
    const entryUpdate = { [rowLabel]: newValue };
    const newColEntry = getColEntry(table, i, entryUpdate);
    // replace column
    const keys = Object.keys(table);
    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      newTable[key][i] = newColEntry[key];
    }
    newTable[rowLabel][i] = e.target.value;
    setTable(newTable);
  };
  return (
    <div style={{ width: "90%" }}>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {
                table.name.map((label) => <TableCell key={label} align="right">{label}</TableCell>)
              }
              <TableCell align="right"><AddNewColumn /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              rowLabels.map((rowLabel) => (
                <TableRow key={`row=${rowLabel}`}>
                  {
                    table[rowLabel].map((value: string | number, i: number) => (
                      <TableCell
                        key={`${rowLabel}-${table.name[i]}`}
                        align="right"
                      >
                        <TableEntry
                          value={value}
                          i={i}
                          rowLabel={rowLabel}
                          isLabel={(i === 0 || rowLabel === "name")}
                          setTableEntry={setTableEntry}
                        />
                      </TableCell>
                    ))
                  }
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const BuyHomeCalcPage = (props: PageProps) => (
  <Layout>
    <SEO title="Page two" />
    <h1>Home Purchase Feasibility Calculator</h1>
    <CalcTable />
    <Link to="/">Go back to the homepage</Link>
  </Layout>
);

export default BuyHomeCalcPage;
