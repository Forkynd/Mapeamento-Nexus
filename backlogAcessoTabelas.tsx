import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import BotaoExportBase from "../../components/ButtonBase/botaoExportarDadosBase";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export default function BacklogAcessoTabelas(props) {
  // Dados - Toggle Base

  const linhasTabela = useMemo(() => {
    if (
      !Array.isArray(props.dadosCardAtivo) ||
      props.dadosCardAtivo.length === 0
    )
      return [];

    const mapa = new Map();

    props.dadosCardAtivo.forEach((item) => {
      const nome = item.GRUPO_ORIGEM ?? "—";

      if (!mapa.has(nome)) {
        mapa.set(nome, {
          nomeGrupo: nome,
          origens: new Set(),
          totalRegistros: 0,
          grupoNome: item.GRUPO_ORIGEM ?? "",
        });
      }

      const grupo = mapa.get(nome);

      if (item?.ORIGEM != null) grupo.origens.add(item.ORIGEM);
      grupo.totalRegistros += 1;
    });

    return Array.from(mapa.values())
      .map((g) => ({
        nomeGrupo: g.nomeGrupo,
        totalOrigem: g.origens.size,
        totalRegistros: g.totalRegistros,
        grupoNome: g.grupoNome,
      }))
      .sort((a, b) => b.totalOrigem - a.totalOrigem);
  }, [props.dadosCardAtivo]);

  return (
    <>
      {props.isPréBaixa && (
        <>
          <p className="BacklogAcessoTabelaPréBaixaInfoGrupos">
            Contém apenas Dados com{" "}
            <b>Quantidade de Pré-Baixas Recusadas maior ou igual à 5</b>.
          </p>
          <div className="BacklogAcessoTabelaPréBaixaBotãoExportBase">
            <BotaoExportBase
              valorWidth={"290px"}
              iconeBotao={<FileDownloadOutlinedIcon />}
              dadosParaExportar={props.dadosCardAtivo}
              nomeDoArquivo={`Backlog Acesso - Dados de Pré-Baixas Recusadas ${props.nomeCardAtivo}`}
              textoDoBotão={"Exportar Dados - Pré-Baixa"}
              isDisabled={false}
              textoTooltip={"Baixar Apenas Dados das Pré-Baixas Recusadas"}
            />
          </div>
        </>
      )}
      <div
        className="BacklogAcessoTabelaAreaConteiner"
        style={{ marginTop: props.isPréBaixa ? "5px" : "10px" }}
      >
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
            <TableHead>
              <TableRow>
                <TableCell
                  className="TabelaDadoIndividualCabecalho"
                  sx={{
                    border: "1.5px solid rgba(128, 128, 128, 0.324)",
                    backgroundColor: "rgb(39, 33, 60)",
                    padding: "0px",
                    margin: "0px",
                    height: "50px",
                    width: "70% !important",
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Grupos Responsáveis
                </TableCell>
                <TableCell
                  className="TabelaDadoIndividualCabecalho"
                  sx={{
                    border: "1.5px solid rgba(128, 128, 128, 0.324)",
                    backgroundColor: "rgb(39, 33, 60)",
                    padding: "0px",
                    margin: "0px",
                    height: "50px",
                    width: "30% !important",
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Total TAs Origem
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody className="TabelaCorpo">
              {linhasTabela.length === 0 ? (
                <TableRow
                  sx={{
                    height: "40px !important",
                    padding: "4px !important",
                  }}
                >
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      height: "40px !important",
                      padding: "2px !important",
                      fontSize: "14px",
                      color: "rgb(51, 51, 51)",
                      fontWeight: "bold",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    Nenhum dado para o card ativo
                  </TableCell>
                </TableRow>
              ) : (
                linhasTabela.map((linha) => (
                  <TableRow
                    key={String(linha.nomeGrupo)}
                    className="TabelaLinhaDados"
                    sx={{
                      "&:hover .TabelaDadoIndividualCorpo": {
                        color: "rgb(145, 89, 236) !important",
                        borderTop: "0.1px solid rgb(145, 89, 236)",
                        borderBottom: "0.1px solid rgb(145, 89, 236)",
                        transition: "0.25s",
                      },
                    }}
                  >
                    <TableCell
                      className="TabelaDadoIndividualCorpo"
                      scope="row"
                      sx={[
                        {
                          color: "black",
                          textAlign: "center",
                          fontWeight: "bold",
                        },
                        {
                          height: "40px !important",
                          "&:nth-child(odd)": {
                            backgroundColor: "rgba(54, 22, 106, 0.24)",
                          },
                        },
                      ]}
                    >
                      {linha.nomeGrupo}
                    </TableCell>
                    <TableCell
                      className="TabelaDadoIndividualCorpo"
                      sx={{ textAlign: "center", fontWeight: 600 }}
                    >
                      {linha.totalOrigem}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
