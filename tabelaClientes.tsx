import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function BacklogAcessoTabelasClientes(props) {
  const [alignment, setAlignment] = useState("decorrido");
  const [chaveGrafico, setChaveGrafico] = useState(0);

  useEffect(() => {
    setChaveGrafico((chaveAnterior) => chaveAnterior + 1);
  }, [alignment]);

  const coresAlternadas: string[] = [
    "#3c0075",
    "#7e00eb",
    "#c57dff",
    "#e6c5ff",
    "#b8c0ff",
    "#c3f4ff",
    "#80eaff",
    "#00b3d8",
    "#0076b6",
    "#000161",
  ];

  // Dados - Toggle Base

  const dadosToggleGrupo = [
    { valor: "decorrido", titulo: "Tempo Decorrido" },
    { valor: "afetação", titulo: "Afetação (UF)" },
    { valor: "causa", titulo: "Causa" },
  ];

  const linhasTabela = useMemo(() => {
    if (
      !Array.isArray(props.dadosCardAtivo) ||
      props.dadosCardAtivo.length === 0
    )
      return [];

    const mapa = new Map();

    props.dadosCardAtivo.forEach((item) => {
      const nome = item.AREA_DESTINO_ACIONADA ?? "—";

      if (!mapa.has(nome)) {
        mapa.set(nome, {
          nomeGrupo: nome,
          origens: new Set(),
          totalRegistros: 0,
          grupoNome: item.AREA_DESTINO_ACIONADA ?? "",
        });
      }

      const grupo = mapa.get(nome);

      if (item?.NUM_EVENTO != null) grupo.origens.add(item.NUM_EVENTO);
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
                  Total Eventos
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
