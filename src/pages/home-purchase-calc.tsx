import React, { useState, ChangeEvent, useCallback } from "react";
import { PageProps, Link } from "gatsby";
import NumberFormat from "react-number-format";

// Material UI
import {
  makeStyles, withStyles, Theme, createStyles
} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Alert, AlertTitle } from "@material-ui/lab";

// import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CreateIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import { TextField, Button } from "@material-ui/core";

import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";

// Libs
import { clone } from "ramda";
import SEO from "../components/seo";
import Layout from "../components/layout";
import DollarInput from "../lib/dollarInput";
import DialogContainer, { DialogActions, DialogContent } from "../lib/dialogContainer";

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    minWidth: 650,
    marginTop: theme.spacing(1)
  },
  tableInput: {
    width: 100
  },
  inlineIconButton: {
    marginTop: -theme.spacing(1),
    marginLeft: -theme.spacing(1) * 1.2
  }
}));

interface PropertyData {
  asking: number | undefined;
  downPaymentPct: number | undefined;
  interestRate: number | undefined;
  maintenance: number | undefined;
  name: string | undefined;
  offer: number | undefined;
  startAsset: number | undefined;
  closing: number | undefined;
}
const InitPropertyData = {
  asking: undefined,
  downPaymentPct: undefined,
  interestRate: undefined,
  maintenance: undefined,
  name: undefined,
  offer: undefined,
  startAsset: undefined,
  closing: undefined
};
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
    <Fab size="small" color="secondary" aria-label="add new property" className={classes.margin}>
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
      <TextField
        id={`${rowLabel}-${i}`}
        className={classes.tableInput}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
          inputProps: {
            style: { textAlign: "right" }
          }
        }}
        value={value}
        onChange={setTableEntry(rowLabel, i)}
      />
    );
  case "adjustableDollar":
    return (
      <DollarInput
        id={`${rowLabel}-${i}`}
        className={classes.tableInput}
        value={value}
        onChange={setTableEntry(rowLabel, i)}
        rightAlign
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

// Utils
const getColFromTable = (table, i) => ({
  name: table.name[i],
  startAsset: table.startAsset[i],
  asking: table.asking[i],
  offer: table.offer[i],
  downPaymentPct: table.downPaymentPct[i],
  closing: table.closing[i],
  interestRate: table.interestRate[i],
  maintenance: table.maintenance[i]
});

const getUpdatedCol = (table, i, entryUpdate) => {
  const colFromTable = getColFromTable(table, i);
  const newColArgs = {
    ...colFromTable,
    ...entryUpdate
  };
  const newCol = createNewEntry(newColArgs);
  return newCol;
};
const CalcTable = ({
  table,
  openDialog,
  setTableEntry
}: {
  table: any
  openDialog: any;
  setTableEntry: any;
}) => {
  const classes = useStyles();
  const editClick = useCallback((i) => () => {
    openDialog(i);
  }, [openDialog]);

  const addNewClick = useCallback(() => {
    openDialog();
  }, [openDialog]);

  return (
    <div style={{ width: "90%" }}>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="home purchase feasibility calculator">
          <TableHead>
            <TableRow>
              {
                table.name.map((label: string, i: number) => (
                  <TableCell key={label} align="right">
                    <Grid container spacing={1}>
                      <Grid item xs>
                        {label}
                      </Grid>
                      {label.length > 0 && (
                        <Grid item xs={1}>
                          <IconButton
                            aria-label="edit property information"
                            className={classes.inlineIconButton}
                            onClick={editClick(i)}
                          >
                            <CreateIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  </TableCell>
                ))
              }
              <TableCell align="right">
                <Fab
                  onClick={addNewClick}
                  size="small"
                  className={classes.inlineIconButton}
                  color="secondary"
                  aria-label="add new property to table"
                >
                  <AddIcon />
                </Fab>
              </TableCell>
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

const useInputChange = (setValue: (val: string) => void, onChange?: (val: string) => void) => useCallback(({
  target: {
    value
  }
}: ChangeEvent<HTMLInputElement>) => {
  setValue(value);
  if (onChange) {
    onChange(value);
  }
}, [setValue, onChange]);

const useFormInput = (
  setValue: (update: any) => void,
  fieldName: string
) => {
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue({ [fieldName]: e.target.value });
  }, [fieldName, setValue]);
  return onChange;
};

const DialogInner = ({ propertyData, saveAndClose, displayAlert }: {
  propertyData: PropertyData; saveAndClose: any; displayAlert: boolean;
}) => {
  const [state, setState] = useState(propertyData);
  const onSaveClick = useCallback(() => {
    saveAndClose(state);
  }, [saveAndClose, state]);
  const setValue = useCallback((value) => {
    setState({
      ...state,
      ...value
    });
  }, [state]);
  const {
    name, maintenance, asking, offer, downPaymentPct, interestRate, startAsset, closing
  } = state;
  return (
    <>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          Fill out information for the property.
        </DialogContentText>
        {displayAlert && (
          <Alert severity="error">
            <AlertTitle>Missing fields</AlertTitle>
            At least one required field is undefined
          </Alert>
        )}
        <Grid container spacing={1}>
          <Grid item lg={12} xs={12} sm={12}>
            <TextField fullWidth label="name" defaultValue={name} onChange={useFormInput(setValue, "name")} />
          </Grid>
          <Grid item lg={12} xs={12} sm={12}>
            <DollarInput
              id="dialog-form-maintenance"
              value={maintenance}
              onChange={useFormInput(setValue, "maintenance")}
              label="Maintenance"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DollarInput
              id="dialog-form-asking"
              value={asking}
              onChange={useFormInput(setValue, "asking")}
              label="Asking Price"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DollarInput
              id="dialog-form-offer"
              value={offer}
              onChange={useFormInput(setValue, "offer")}
              label="Offer"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="dialog-form-downPaymentPct"
              label="Down Payment"
              value={downPaymentPct}
              onChange={useFormInput(setValue, "downPaymentPct")}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: {
                  style: { textAlign: "right" }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>

            <TextField
              id="dialog-form-interestRate"
              label="Interest Rate"
              value={interestRate}
              onChange={useFormInput(setValue, "interestRate")}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: {
                  style: { textAlign: "right" }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DollarInput
              id="dialog-form-startAsset"
              value={startAsset}
              onChange={useFormInput(setValue, "startAsset")}
              label="Start Asset"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DollarInput
              id="dialog-form-closing"
              value={closing}
              onChange={useFormInput(setValue, "closing")}
              label="Closing"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onSaveClick} color="primary">
          Save changes
        </Button>
      </DialogActions>
    </>
  );
};

const InitialDialogState = {
  open: false,
  displayAlert: false,
  title: "",
  propertyIndex: -1,
  propertyData: InitPropertyData
};

const BuyHomeCalcPage = (props: PageProps) => {
  const [state, setState] = React.useState(InitialDialogState);

  const [globalFinancial, setGlobalFinancial] = useState({
    closing: 10000,
    startAsset: 50000,
    interestRate: 3.25
  });
  const [table, setTable] = useState(createTable());

  const updateGlobalFinancial = useCallback(
    (rowLabel) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (Number.isNaN(Number(newValue))) return;
      setGlobalFinancial({
        ...globalFinancial,
        [rowLabel]: newValue
      });
      const newTable = clone(table);
      const entryUpdate = { [rowLabel]: newValue };
      const totalCols = table.name.length;
      for (let i = 1; i < totalCols; i += 1) {
        const newColEntry = getUpdatedCol(table, i, entryUpdate);
        // replace column
        const keys = Object.keys(table);
        // eslint-disable-next-line no-restricted-syntax
        for (const key of keys) {
          newTable[key][i] = newColEntry[key];
        }
      }
      setTable(newTable);
    }, [globalFinancial, table]
  );

  const setTableEntry = useCallback((rowLabel: string, i: number) => (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newValue = Number(e.target.value);
    if (Number.isNaN(Number(newValue))) return;
    const newTable = clone(table);
    newTable[rowLabel][i] = newValue;
    const entryUpdate = { [rowLabel]: newValue };
    const newColEntry = getUpdatedCol(table, i, entryUpdate);
    // replace column
    const keys = Object.keys(table);
    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      newTable[key][i] = newColEntry[key];
    }
    newTable[rowLabel][i] = e.target.value;
    setTable(newTable);
  }, [table]);

  const openDialog = (i?: number) => {
    const globalOverwrite = (i === undefined) ? globalFinancial : {};
    const propertyData = {
      ...getColFromTable(table, i),
      ...globalOverwrite
    };
    const propertyIndex = i || table.name.length;
    const title = (i === undefined) ? "Add Property" : "Edit Property";
    setState({
      open: true,
      displayAlert: false,
      title,
      propertyIndex,
      propertyData
    });
  };
  const closeDialog = useCallback(() => {
    setState({ ...state, open: false });
  }, [state]);
  const saveAndCloseDialog = useCallback((updateData) => {
    const fieldValues = Object.values(updateData);
    console.log("FIELD VALUES", fieldValues);
    if (fieldValues.includes(undefined) || fieldValues.includes("")) {
      setState({
        ...state,
        displayAlert: true
      });
      return;
    }
    const fields = Object.keys(table);
    const newTable = clone(table);
    const { propertyIndex } = state;
    const newCol = createNewEntry({
      ...updateData,
      ...globalFinancial
    });

    for (const field of fields) {
      newTable[field][propertyIndex] = newCol[field];
    }
    setTable(newTable);

    setState({
      ...state,
      open: false,
      displayAlert: false
    });
  }, [globalFinancial, state, table]);
  const { closing, startAsset, interestRate } = globalFinancial;
  return (
    <Layout>
      <SEO title="Home Purchase Feasibility Calculator" />
      <h1>Home Purchase Feasibility Calculator</h1>
      <DialogContainer
        title={state.title}
        open={state.open}
        closeDialog={closeDialog}
      >
        <DialogInner
          propertyData={state.propertyData}
          displayAlert={state.displayAlert}
          saveAndClose={saveAndCloseDialog}
        />
      </DialogContainer>
      <div style={{ paddingTop: 20 }}>
        <h2>Global Financial Variables</h2>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <DollarInput
              id="global-start-asset"
              value={startAsset}
              onChange={updateGlobalFinancial("startAsset")}
              label="Start Asset"
            />
          </Grid>
          <Grid item xs={3}>
            <DollarInput
              id="global-closing-cost"
              value={closing}
              onChange={updateGlobalFinancial("closing")}
              label="Closing Cost"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="global-interest-rate"
              label="Interest Rate"
              value={interestRate}
              onChange={updateGlobalFinancial("interestRate")}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: {
                  style: { textAlign: "right" }
                }
              }}
            />
          </Grid>
        </Grid>
      </div>
      <div style={{ paddingTop: 40, paddingBottom: 40 }}>
        <h2>Comparisons</h2>
        <CalcTable table={table} openDialog={openDialog} setTableEntry={setTableEntry} />
      </div>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  );
};

export default BuyHomeCalcPage;
