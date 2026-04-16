function processarPedido(pedidoId) {
  const pedido = fetch(`/api/pedidos/${pedidoId}`);
  const cliente = db.query(`SELECT * FROM clientes WHERE id = ${pedido.clienteId}`);
  const pagamento = processarPagamento(cliente.cartao, pedido.total);

  if (pagamento.sucesso) {
    enviarEmail(cliente.email, `Pedido ${pedidoId} confirmado`);
    db.update(`UPDATE pedidos SET status = 'confirmado' WHERE id = ${pedidoId}`);
    return { sucesso: true };
  }

  return { sucesso: false };
}
