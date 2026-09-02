export default function CardCimaBacklogAcesso(props) {
  return (
    <div className="CardIndividualCima" onClick={props.onClick}>
      <table className="CardTableCima">
        <thead>
          <tr>
            <th className="tableCimaTopo">
              <span className="CardBacklogAcessoTitulo">{props.titulo}</span>
            </th>
          </tr>
        </thead>
        <tbody
          style={{
            backgroundColor: props.corDeFundoCards
              ? props.corDeFundoCards
              : "white",
          }}
        >
          <tr>
            <td className="tableNumCima">{props.numero}</td>
          </tr>
          <tr>
            <td className="tableRodCima">Total TAs Distintos</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
