import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import BotaoExportBase from "../../components/ButtonBase/botaoExportarDadosBase";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export default function BacklogAcessoTabelaPréBaixa(props) {
  const colunasVolumetria = {
    AREA_RESPONSAVEL_EFETIVA: "Área Responsável Origem",
    P1: "P1",
    P2: "P2",
    P3: "P3",
    P4: "P4",
    TOTAL_GERAL: "Total Geral",
  };

  const colunasParaExibirVolumetria = Object.keys(colunasVolumetria);

  return (
    <>
      <p className="BacklogAcessoTabelaPréBaixaInfo">
        Contém apenas Dados com{" "}
        <b>Quantidade de Pré-Baixas Recusadas maior ou igual à 5</b>.
      </p>
      <div className="BacklogAcessoTabelaPréBaixaBotãoExportBase">
        <BotaoExportBase
          valorWidth={"290px"}
          iconeBotao={<FileDownloadOutlinedIcon />}
          dadosParaExportar={props.dadosDownload}
          nomeDoArquivo={`Backlog Acesso - Dados de Pré-Baixas Recusadas ${props.nomeCardAtivo}`}
          textoDoBotão={"Exportar Dados - Pré-Baixa"}
          isDisabled={false}
          textoTooltip={"Baixar Apenas Dados das Pré-Baixas Recusadas"}
        />
      </div>
      <div className="BacklogAcessoTabelaGeralConteiner">
        <TableContainer className="CaixaTabelaAlarme">
          <Table
            stickyHeader
            className="TabelaAlarme"
            sx={{
              margin: "0",
              padding: "0",
              boxShadow: "4px 6px 16px -6px rgba(0,0,0,1)",
              fontFamily: "Helvetica, Arial, sans-serif !important",
            }}
            size="small"
          >
            <TableHead
              sx={[
                {
                  height: "40px !important",
                  "&:nth-child(odd)": {
                    backgroundColor: "rgba(128, 128, 128, 0.2)",
                  },
                },
                {
                  "&:hover .TabelaTopoLinhaAlarmesBase": {
                    color: "rgb(145, 89, 236) !important",
                    transition: "0.25s",
                  },
                },
              ]}
            >
              <TableRow>
                {colunasParaExibirVolumetria.map((column, index) => (
                  <TableCell
                    className="TabelaTopoLinhaAlarmesBase"
                    key={index}
                    sx={[
                      {
                        color: "white",
                        backgroundColor: "rgb(54, 22, 106)",
                        border: "1px solid rgba(128, 128, 128, 0.324)",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "0px",
                        margin: "0px",
                        height: "5px !important",
                      },
                      {
                        "&:hover": {
                          color: "rgb(145, 89, 236)",
                        },
                      },
                    ]}
                  >
                    <div className="SubTabelaAlarmeTituloCabecalho">
                      <span className="SubTabelaAlarmeTituloIndividual">
                        {colunasVolumetria[column]}
                      </span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className="TabelaAlarmeCorpo">
              {props.linhasTabela.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="TabelaAlarmeLinhaDados"
                  sx={[
                    {
                      height: "20px !important",
                      "&:nth-child(odd)": {
                        backgroundColor: "rgba(128, 128, 128, 0.2)",
                      },
                    },
                    {
                      "&:hover .TabelaAlarmeDadoIndividualCorpo": {
                        color: "rgb(145, 89, 236) !important",
                        borderTop: "0.1px solid black",
                        borderBottom: "0.1px solid black",
                        transition: "0.25s",
                      },
                    },
                  ]}
                >
                  {colunasParaExibirVolumetria.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className="TabelaAlarmeDadoIndividualCorpo"
                      sx={[
                        {
                          border: "1px solid rgba(128, 128, 128, 0.324)",
                          textAlign: "center",
                          fontSize: "12px",
                          padding: "0px",
                          margin: "0px",
                          height: "5px !important",
                        },
                        {
                          "&:hover": {
                            color: "rgb(145, 89, 236)",
                            border: "1px solid rgb(145, 89, 236)",
                          },
                          "&:nth-child(1), &:nth-child(6)": {
                            border: "1.5px solid rgba(128, 128, 128, 0.324)",
                            textAlign: "center !important",
                            backgroundColor:
                              "rgba(54, 22, 106, 0.24) !important",
                            color: "black",
                            fontWeight: "bold",
                            top: "0",
                            zIndex: "1",
                            padding: "0px",
                            margin: "0px",
                            height: "20px",
                          },
                          "&:nth-child(1)": {
                            width: "350px !important",
                          },
                          "&:nth-child(2), &:nth-child(3), &:nth-child(4), &:nth-child(5)":
                            {
                              width: "60px !important",
                            },
                        },
                      ]}
                    >
                      {row[column]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow
                className="TabelaAlarmeLinhaDados"
                sx={[
                  {
                    height: "20px !important",
                    "&:nth-child(odd)": {
                      backgroundColor: "rgba(128, 128, 128, 0.2)",
                    },
                  },
                  {
                    "&:hover .TabelaAlarmeDadoIndividualCorpo": {
                      color: "rgb(145, 89, 236) !important",
                      transition: "0.25s",
                    },
                  },
                ]}
              >
                <TableCell
                  className="TabelaAlarmeDadoIndividualCorpo"
                  sx={[
                    {
                      color: "white",
                      backgroundColor: "rgb(54, 22, 106)",
                      border: "1px solid rgba(128, 128, 128, 0.324)",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "0px",
                      margin: "0px",
                      height: "5px !important",
                    },
                    {
                      "&:hover": {
                        color: "rgb(145, 89, 236)",
                      },
                      "&:nth-child(odd)": {
                        fontWeight: "bold",
                      },
                    },
                  ]}
                >
                  Total Geral
                </TableCell>
                <TableCell
                  className="TabelaAlarmeDadoIndividualCorpo"
                  sx={[
                    {
                      color: "white",
                      backgroundColor: "rgb(54, 22, 106)",
                      border: "1px solid rgba(128, 128, 128, 0.324)",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "0px",
                      margin: "0px",
                      height: "5px !important",
                    },
                    {
                      "&:hover": {
                        color: "rgb(145, 89, 236)",
                      },
                    },
                  ]}
                >
                  {props.totaisTabela.P1}
                </TableCell>
                <TableCell
                  className="TabelaAlarmeDadoIndividualCorpo"
                  sx={[
                    {
                      color: "white",
                      backgroundColor: "rgb(54, 22, 106)",
                      border: "1px solid rgba(128, 128, 128, 0.324)",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "0px",
                      margin: "0px",
                      height: "5px !important",
                    },
                    {
                      "&:hover": {
                        color: "rgb(145, 89, 236)",
                      },
                    },
                  ]}
                >
                  {props.totaisTabela.P2}
                </TableCell>
                <TableCell
                  className="TabelaAlarmeDadoIndividualCorpo"
                  sx={[
                    {
                      color: "white",
                      backgroundColor: "rgb(54, 22, 106)",
                      border: "1px solid rgba(128, 128, 128, 0.324)",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "0px",
                      margin: "0px",
                      height: "5px !important",
                    },
                    {
                      "&:hover": {
                        color: "rgb(145, 89, 236)",
                      },
                    },
                  ]}
                >
                  {props.totaisTabela.P3}
                </TableCell>
                <TableCell
                  className="TabelaAlarmeDadoIndividualCorpo"
                  sx={[
                    {
                      color: "white",
                      backgroundColor: "rgb(54, 22, 106)",
                      border: "1px solid rgba(128, 128, 128, 0.324)",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "0px",
                      margin: "0px",
                      height: "5px !important",
                    },
                    {
                      "&:hover": {
                        color: "rgb(145, 89, 236)",
                      },
                    },
                  ]}
                >
                  {props.totaisTabela.P4}
                </TableCell>
                <TableCell
                  className="TabelaAlarmeDadoIndividualCorpo"
                  sx={[
                    {
                      color: "white",
                      backgroundColor: "rgb(54, 22, 106)",
                      border: "1px solid rgba(128, 128, 128, 0.324)",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "0px",
                      margin: "0px",
                      height: "5px !important",
                    },
                    {
                      "&:hover": {
                        color: "rgb(145, 89, 236)",
                      },
                    },
                  ]}
                >
                  {props.totaisTabela.TOTAL_GERAL}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
