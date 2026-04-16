function calcularTotalComDesconto(pedido, cliente) {
  const limiteSaldo = cliente.saldoDisponivel;

  let total = pedido.total;

  if (pedido.cupom) {
    const desconto = aplicarCupom(pedido.cupom, total);

    if (desconto <= limiteSaldo) {
      total -= desconto;
    }
  }

  return total;
}

function aplicarCupom(cupom, valor) {
  if (cupom.tipo === "PERCENTUAL") {
    return valor * cupom.valor;
  }

  if (cupom.tipo === "FIXO") {
    return cupom.valor;
  }

  return 0;
}

function processarPedido(
  pedido,
  cliente,
  pagamentoService,
  notificador,
  pedidoRepository,
) {
  const totalFinal = calcularTotalComDesconto(pedido, cliente);

  const pagamento = pagamentoService.processar(cliente.cartao, totalFinal);

  if (!pagamento.sucesso) {
    return { sucesso: false };
  }

  pedidoRepository.confirmar(pedido.id);
  notificador.enviarConfirmacao(cliente.email, pedido.id);

  return { sucesso: true };
}
