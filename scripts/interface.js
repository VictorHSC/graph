const container = document.getElementById('graph');

const interface_nodes = new vis.DataSet();
const interface_edges = new vis.DataSet();

const interface_network_options = {
    interaction: {
        tooltipDelay: 100,
        zoomSpeed: 0.25
    },
    nodes: {
        borderWidth: 1,
        borderWidthSelected: 2,
        color: {
            background: '#FFF',
            border: '#90CBF0',
            highlight: {
                background: '#FFF',
                border: '#F09294'
            }
        }
    },
    edges: {
        width: 1,
        color: {
            color: '#90CBF0',
            highlight: '#F09294'
        },
        selectionWidth: 3
    }
}

const interface_network = new vis.Network(container, { nodes: interface_nodes, edges: interface_edges }, interface_network_options);

const interface_input_dirigido = document.getElementById('input_dirigido');
const interface_input_vertice_id = document.getElementById('input_vertice_id');
const interface_input_vertice_descricao = document.getElementById('input_vertice_descricao');
const interface_input_conexao_tipo = document.getElementById('input_conexao_tipo');
const interface_input_conexao_id_origem = document.getElementById('input_conexao_id_origem');
const interface_input_conexao_id_destino = document.getElementById('input_conexao_id_destino');
const interface_log = document.getElementById('log');

function interfaceAddConexao(conexao) {

    let id_origem = (conexao && conexao.id_origem) || +interface_input_conexao_id_origem.value;
    let id_destino = (conexao && conexao.id_destino) || +interface_input_conexao_id_destino.value;
    let tipo = conexao && conexao.tipo;
    if (!tipo)
        tipo = interface_input_dirigido.checked ? 'arco' : 'aresta';

    newEdge = grafoAddConexao(id_origem, id_destino, tipo);

    newEdge.from = newEdge.id_origem;
    newEdge.to = newEdge.id_destino;

    if (interface_input_dirigido.checked) {

        newEdge.arrows = 'to';
    }

    interface_edges.add(newEdge);
}

function interfaceAddVertice(vertice) {

    let id = (vertice && vertice.id) || +interface_input_vertice_id.value || 0;
    let descricao = (vertice && vertice.descricao) || interface_input_vertice_descricao.value

    let newNode = grafoAddVertice(id, descricao);
    newNode.label = newNode.descricao;
    newNode.title = "Id: " + newNode.id + "\nDesc.: " + newNode.descricao;
    if (vertice.x && vertice.y) {
        newNode.x = vertice.x * 100;
        newNode.y = vertice.y * 100;
    }
    interface_nodes.add(newNode);
    interfaceLimparInputVertice()
    updateCheckboxDirigido();
}

function interfaceAlterarDirigido() {
    if (vertices.length != 0) {
        console.log("error");
    }
}

function interfaceAlterarFisica() {
    interface_network_options.physics = false;
    interface_network.setOptions(interface_network_options);
}

function interfaceBuscaProfundidade() {
    grafoBuscaProfundidade(interface_network.getSelectedNodes()[0]);
}

function interfaceBuscaLargura() {
    grafoBuscaLargura(interface_network.getSelectedNodes()[0]);
}

async function interfaceGerarSudoku(N) {

    interfaceAlterarFisica(false);

    let sqrtN = Math.sqrt(N);

    // Cria todos os véritices
    for (let i = 1; i <= N; i++) {
        for (let j = 1; j <= N; j++) {
            interfaceAddVertice({ descricao: i + ',' + j, x: j, y: i });
        }
    }

    await new Promise(r => setTimeout(r, 1000));

    let ci;
    let cj;

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            // percorre cada item da matriz [i, j]

            await new Promise(r => setTimeout(r, 5))

            // Cria as conexões com os vertices a direita
            for (let xi = i + 1; xi < N; xi++) {
                newEdge = grafoAddConexao(i * N + j, xi * N + j, 'aresta');
                newEdge.from = newEdge.id_origem;
                newEdge.to = newEdge.id_destino;
                interface_edges.add(newEdge);
            }

            // Cria as conexões com os vertices a baixo
            for (let xj = j + 1; xj < N; xj++) {
                newEdge = grafoAddConexao(i * N + j, i * N + xj, 'aresta');
                newEdge.from = newEdge.id_origem;
                newEdge.to = newEdge.id_destino;
                interface_edges.add(newEdge);
            }

            // Cria as conexões na diagonal baixo-direita (primária)
            ci = 1;
            for (let xi = (i % sqrtN) + 1; xi < sqrtN; xi++) {
                cj = 1
                for (let xj = (j % sqrtN) + 1; xj < sqrtN; xj++) {
                    newEdge = grafoAddConexao(i * N + j, (i + ci) * N + j + cj, 'aresta');
                    newEdge.from = newEdge.id_origem;
                    newEdge.to = newEdge.id_destino;
                    interface_edges.add(newEdge);
                    cj++;
                }
                ci++;
            }

            // Cria as conexões na diagonal baixo-esquerda (secundária)
            ci = 1;
            for (let xi = (i % sqrtN) + 1; xi < sqrtN; xi++) {
                cj = 1;
                for (let xj = j % sqrtN; xj > 0; xj--) {
                    newEdge = grafoAddConexao(i * N + j, (i + ci) * N + j - cj, 'aresta');
                    newEdge.from = newEdge.id_origem;
                    newEdge.to = newEdge.id_destino;
                    interface_edges.add(newEdge);
                    cj++;
                }
                ci++;
            }
        }
    }
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

function updateCheckboxDirigido() {
    interface_input_dirigido.disabled = vertices.length != 0;
}

addEventListener('keyup', e => {
    if (e.keyCode === 8) {
        interface_network.getSelectedNodes().forEach(node => {
            node = interface_nodes.get(node);
            grafoRemVertice(node);
            interface_nodes.remove(node);
            updateCheckboxDirigido();
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