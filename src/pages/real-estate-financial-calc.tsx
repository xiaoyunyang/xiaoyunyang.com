import React from "react";
import { PageProps, Link } from "gatsby";

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
import SEO from "../components/seo";
import Layout from "../components/layout";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return {
    name, calories, fat, carbs, protein
  };
}
const createNewCol = ({
  name, liquidAsset, asking, offer, downPaymentPct, closing, interestRate, maintenance
}: {
  name: string,
  liquidAsset: number,
  asking: number,
  offer: number,
  downPaymentPct: number,
  closing: number,
  interestRate: number,
  maintenance: number
}) => {

};
const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9)
];
const AddNewColumn = () => {
  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1)
    }
  }));
  const classes = useStyles();

  return (
    <Fab size="small" color="secondary" aria-label="add" className={classes.margin}>
      <AddIcon />
    </Fab>
  );
};
const CalcTable = () => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right"><AddNewColumn /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Calc = () => (
  <div style={{ width: "90%" }}>
    <CalcTable />
  </div>
);

const BuyHomeCalcPage = (props: PageProps) => (
  <Layout>
    <SEO title="Page two" />
    <h1>Real Estate Financial Calculator</h1>
    <Calc />
    <Link to="/">Go back to the homepage</Link>
  </Layout>
);

export default BuyHomeCalcPage;
