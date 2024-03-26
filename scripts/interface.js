const container = document.getElementById('visualizacao');

const interface_nodes = new vis.DataSet();
const interface_edges = new vis.DataSet();

const interface_network_options = {
    interaction: {
        tooltipDelay: 100,
        zoomSpeed: 0.25
    },
    nodes: {
        borderWidth: 2,
        color: {
            background: '#F2F2F2',
            border: '#2C7359',
            highlight: {
                background: '#F2F2F2',
                border: '#2C7359'
            }
        }
    },
    edges: {
        width: 2,
        color: '#2C7359'
    }
}

const interface_network = new vis.Network(container, { nodes: interface_nodes, edges: interface_edges }, interface_network_options);

const interface_input_vertice_id = document.getElementById('input_vertice_id');
const interface_input_vertice_descricao = document.getElementById('input_vertice_descricao');
const interface_input_conexao_tipo = document.getElementById('input_conexao_tipo');
const interface_input_conexao_id_origem = document.getElementById('input_conexao_id_origem');
const interface_input_conexao_id_destino = document.getElementById('input_conexao_id_destino');
const interface_log = document.getElementById('log');

function interfaceAddConexao(conexao) {

    let tipo = (conexao && conexao.tipo) || interface_input_conexao_tipo.value

    switch (tipo) {
        case 'arco':
            interfaceAddArco(conexao);
            break;
        case 'aresta':
            interfaceAddAresta(conexao);
            break;
        default:
            console.error('interfaceAddConexao > erro no switch!');
    }
}

function interfaceAddArco(conexao) {

    let id_origem = (conexao && conexao.id_origem) || +interface_input_conexao_id_origem.value;
    let id_destino = (conexao && conexao.id_destino) || +interface_input_conexao_id_destino.value;

    let newEdge = grafoAddArco(id_origem, id_destino);
    newEdge.from = newEdge.id_origem;
    newEdge.to = newEdge.id_destino;
    newEdge.arrows = 'to';

    if (newEdge.atualizacao) {
        let edge = interface_edges.get({
            filter: function (e) {
                return e.from == newEdge.from && e.to == newEdge.to;
            }
        })[0];

        edge.arrows = '';
        edge.tipo = newEdge.tipo;
        interface_edges.update(edge);
    } else {

        interface_edges.add(newEdge);
    }
}

function interfaceAddAresta(conexao) {

    let id_origem = (conexao && conexao.id_origem) || +interface_input_conexao_id_origem.value;
    let id_destino = (conexao && conexao.id_destino) || +interface_input_conexao_id_destino.value;

    let newEdge = grafoAddAresta(id_origem, id_destino);
    newEdge.from = newEdge.id_origem;
    newEdge.to = newEdge.id_destino;

    if (newEdge.atualizacao) {
        let edge = interface_edges.get({
            filter: function (e) {
                return e.from == newEdge.from && e.to == newEdge.to;
            }
        })[0];

        edge.arrows = '';
        edge.tipo = newEdge.tipo;
        interface_edges.update(edge);
    } else {

        interface_edges.add(newEdge);
    }
}

function interfaceAddVertice(vertice) {

    let id = (vertice && vertice.id) || +interface_input_vertice_id.value || 0;
    let descricao = (vertice && vertice.descricao) || interface_input_vertice_descricao.value

    let newNode = grafoAddVertice(id, descricao);
    newNode.label = newNode.descricao;
    newNode.title = "Id: " + newNode.id + "\nDesc.: " + newNode.descricao;
    interface_nodes.add(newNode);
    interfaceLimparInputVertice()
}

function interfaceBuscaProfundidade() {
    grafoBuscaProfundidade(interface_network.getSelectedNodes()[0]);
}

function interfaceBuscaLargura() {
    grafoBuscaLargura(interface_network.getSelectedNodes()[0]);
}

function interfaceLimparInputVertice() {
    interface_input_vertice_id.value = +interface_input_vertice_id.value + 1;
    interface_input_vertice_descricao.value = "";
}

function interfaceUpdateOptionsConexao(element) {
    element.length = 0;
    interface_nodes.forEach(node => {
        element.options[element.options.length] = new Option(node.label, node.id);
    });
}

addEventListener('keyup', e => {
    if (e.keyCode === 8) {
        interface_network.getSelectedNodes().forEach(node => {
            node = interface_nodes.get(node);
            grafoRemVertice(node);
            interface_nodes.remove(node);
        });
        interface_network.getSelectedEdges().forEach(edge => {
            edge = interface_edges.get(edge);
            grafoRemConexao(edge);
            interface_edges.remove(edge);
        });
    }
});


// LIMBO


const visitando = function (id) {
    nodes.getIds().forEach(id => {
        let node = nodes.get(id);
        node.color = {
            background: '#F2F2F2',
            border: '#2C7359'
        }
        nodes.update(node);
    });

    let node = nodes.get(id);
    node.color = {
        background: '#F2F2F2',
        border: '#FF0000'
    }

    nodes.update(node);
}

function interfaceCarregarArquivo(event) {
    vertices.splice(0, vertices.length)
    conexoes.splice(0, conexoes.length)
    interface_nodes.forEach(n => interface_nodes.remove(n));
    //interface_nodes.update();
    interface_edges.forEach(e => interface_edges.remove(e));
    //interface_edges.update();
    interface_input_vertice_id.value = 0;
    var meuImput = document.getElementById('input_carregar_arquivo');
    var reader = new FileReader();
    reader.readAsDataURL(meuImput.files[0]);
    reader.onload = function () {
        // Aqui temos a sua imagem convertida em string em base64.
        let grafo = JSON.parse(atob(reader.result.split(',')[1]));

        grafo.vertices.forEach(vertice => {
            interfaceAddVertice(vertice);
        });

        grafo.conexoes.forEach(conexao => {
            interfaceAddConexao(conexao);
        });
    };
}

function interfaceLog(message) {
    let p_element = document.createElement("p");
    let message_element = document.createTextNode(message);
    p_element.appendChild(message_element);
    interface_log.appendChild(p_element);
}

function interfaceConectividade() {
    grafoAtualizarMatrizAdjacencia();

    let parte_de_subgrafos = [];
    let subgrafos = [];

    while (parte_de_subgrafos.length < vertices.length) {
        let vertice = getFirstNotInSubGraph();
        console.log(vertice);

        let fecho_direto = grafoGetFechoTransitivoDireto(vertice);
        console.log(fecho_direto);
        let fecho_inverso = grafoGetFechoTransitivoInverso(vertice);
        console.log(fecho_inverso);

        let intersecao = fecho_direto.filter(v => fecho_inverso.includes(v));

        let subgrafo = [];

        for (let i = 0; i < matrizAdjacencia.length; i++) {
            if (intersecao[i] !== undefined) {
                parte_de_subgrafos.push(i);
                subgrafo.push(i);
            }
        }

        subgrafos.push(subgrafo);
    }

    if (subgrafos.length > 1) {
        interfaceLog("O grafo não é fortemente conexo!, seguem os subgrafos: ");
        subgrafos.forEach(sg => {
            interfaceLog(sg.map(id => vertices.at(id).descricao));
        })
    } else {
        interfaceLog("O grafo é fortemente conexo!");
    }

    function getFirstNotInSubGraph() {
        for (let i = 0; i < matrizAdjacencia.length; i++) {
            if (!parte_de_subgrafos.includes(i))
                return i;
        }
    }
}