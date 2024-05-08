// Interface elements

// Sections
const interface_section_actions = document.getElementById('actions');
const interface_section_log = document.getElementById('log');
const interface_section_graph = document.getElementById('graph');

// Inputs
const interface_input_dirigido = document.getElementById('input_dirigido');
const interface_input_vertice_id = document.getElementById('input_vertice_id');
const interface_input_vertice_descricao = document.getElementById('input_vertice_descricao');
const interface_input_conexao_tipo = document.getElementById('input_conexao_tipo');
const interface_input_conexao_id_origem = document.getElementById('input_conexao_id_origem');
const interface_input_conexao_id_destino = document.getElementById('input_conexao_id_destino');
const interface_input_speed = document.getElementById('interface_input_speed');

// Buttons
const interface_button_remover_vertice = document.getElementById('button_remover_vertice');
const interface_button_remover_conexao = document.getElementById('button_remover_conexao');

// Color palette 
const palette = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9'];

// Vis.js config
const interface_vis_nodes = new vis.DataSet();
const interface_vis_edges = new vis.DataSet();

const interface_vis_options = {
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
                border: '#F2F080'
            }
        }
    },
    edges: {
        width: 1,
        color: {
            color: '#90CBF0',
            highlight: '#F2F080'
        },
        selectionWidth: 3
    }
}

const interface_vis_network = new vis.Network(interface_section_graph, { nodes: interface_vis_nodes, edges: interface_vis_edges }, interface_vis_options);

// Network events
interface_vis_network.on("selectNode", function (params) {
    if (params.nodes.length == 1)
        interface_button_remover_vertice.disabled = false;
});

interface_vis_network.on("deselectNode", function (params) {
    if (params.nodes.length == 0)
        interface_button_remover_vertice.disabled = true;
});

interface_vis_network.on("selectEdge", function (params) {
    if (params.edges.length == 1)
        interface_button_remover_conexao.disabled = false;
});

interface_vis_network.on("deselectEdge", function (params) {
    if (params.edges.length == 0)
        interface_button_remover_conexao.disabled = true;
});

// Interface functions
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

    interface_vis_edges.add(newEdge);
}

function interfaceAddVertice(vertice) {

    let id = (vertice && vertice.id) || +interface_input_vertice_id.value || 0;
    let descricao = (vertice && vertice.descricao) || interface_input_vertice_descricao.value

    let newNode = grafoAddVertice(id, descricao);
    newNode.label = newNode.descricao;
    newNode.title = "Id: " + newNode.id + "\nDesc.: " + newNode.descricao;
    if (vertice && vertice.x && vertice.y) {
        newNode.x = vertice.x * 100;
        newNode.y = vertice.y * 100;
    }
    interface_vis_nodes.add(newNode);
    interfaceLimparInputVertice()
    updateCheckboxDirigido();
}

function interfaceAlterarDirigido() {
    if (vertices.length != 0) {
        console.log("error");
    }
}

function interfaceAlterarFisica() {
    interface_vis_options.physics = false;
    interface_vis_network.setOptions(interface_vis_options);
}

function interfaceBuscaProfundidade() {
    grafoBuscaProfundidade(interface_vis_network.getSelectedNodes()[0]);
}

function interfaceBuscaLargura() {
    grafoBuscaLargura(interface_vis_network.getSelectedNodes()[0]);
}

async function interfaceGerarSudoku(N) {

    // Reseta o grafo
    vertices.splice(0, vertices.length)
    conexoes.splice(0, conexoes.length)
    interface_vis_nodes.forEach(n => interface_vis_nodes.remove(n));
    interface_vis_edges.forEach(e => interface_vis_edges.remove(e));
    interface_input_vertice_id.value = 0;

    interfaceAlterarFisica(false);

    let sqrtN = Math.sqrt(N);

    // Cria todos os véritices
    for (let i = 1; i <= N; i++) {
        for (let j = 1; j <= N; j++) {
            interfaceAddVertice({ descricao: i + ', ' + j, x: j, y: i });
        }
    }

    let ci;
    let cj;

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            // percorre cada item da matriz [i, j]

            await new Promise(r => setTimeout(r, 1))

            // Cria as conexões com os vertices a direita
            for (let xi = i + 1; xi < N; xi++) {
                newEdge = grafoAddConexao(i * N + j, xi * N + j, 'aresta');
                newEdge.from = newEdge.id_origem;
                newEdge.to = newEdge.id_destino;
                interface_vis_edges.add(newEdge);
            }

            // Cria as conexões com os vertices a baixo
            for (let xj = j + 1; xj < N; xj++) {
                newEdge = grafoAddConexao(i * N + j, i * N + xj, 'aresta');
                newEdge.from = newEdge.id_origem;
                newEdge.to = newEdge.id_destino;
                interface_vis_edges.add(newEdge);
            }

            // Cria as conexões na diagonal baixo-direita (primária)
            ci = 1;
            for (let xi = (i % sqrtN) + 1; xi < sqrtN; xi++) {
                cj = 1
                for (let xj = (j % sqrtN) + 1; xj < sqrtN; xj++) {
                    newEdge = grafoAddConexao(i * N + j, (i + ci) * N + j + cj, 'aresta');
                    newEdge.from = newEdge.id_origem;
                    newEdge.to = newEdge.id_destino;
                    interface_vis_edges.add(newEdge);
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
                    interface_vis_edges.add(newEdge);
                    cj++;
                }
                ci++;
            }
        }
    }

    interfaceLog('Grafo ' + N + 'x' + N + ' finalizado!');
}

function interfaceLimparInputVertice() {
    interface_input_vertice_id.value = +interface_input_vertice_id.value + 1;
    interface_input_vertice_descricao.value = "";
}

function interfaceUpdateOptionsConexao(element) {
    element.length = 0;
    interface_vis_nodes.forEach(node => {
        element.options[element.options.length] = new Option(node.label, node.id);
    });
}

function updateCheckboxDirigido() {
    interface_input_dirigido.disabled = vertices.length != 0;
}

async function interfaceColorirGrafo() {

    let cores = [];

    // Define os graus e saturacao dos vértices e remove as cores (caso já tivesse)
    interface_vis_nodes.get().forEach(node => {
        node.grau = interface_vis_edges.get().filter(edge => edge.from == node.id).length;
        node.saturacao = 0;
        node.color = {
            background: '#FFF',
            border: '#90CBF0'
        }
        node.colored = false;
    });

    interface_vis_nodes.update(interface_vis_nodes.get());

    let vertice_inicial = interface_vis_network.getSelectedNodes().map(n => interface_vis_nodes.get(n))[0] || interface_vis_nodes.get()[0];

    interface_vis_edges.get().filter(e => e.from == vertice_inicial.id || e.to == vertice_inicial.id).forEach(e => {
        let id = e.from == vertice_inicial.id ? e.to : e.from;
        let vertice_adjacente = interface_vis_nodes.get().filter(n => n.id == id)[0];
        vertice_adjacente.saturacao++;
    });

    vertice_inicial.color = getColor();
    vertice_inicial.colored = true;
    cores.push(vertice_inicial.color);

    interface_vis_nodes.update(vertice_inicial);

    await new Promise(r => setTimeout(r, interface_input_speed.value));

    while (interface_vis_nodes.get().filter(node => node.colored).length < interface_vis_nodes.get().length) {

        let vertice_atual = interface_vis_nodes.get().filter(n => !n.colored).sort((a, b) => a.saturacao < b.saturacao)[0];
        let cores_disponiveis = cores.slice();

        interface_vis_edges.get().filter(e => e.from == vertice_atual.id || e.to == vertice_atual.id).forEach(e => {
            let id = e.from == vertice_atual.id ? e.to : e.from;
            let vertice_adjacente = interface_vis_nodes.get().filter(n => n.id == id)[0];
            if (vertice_adjacente.colored && cores_disponiveis.includes(vertice_adjacente.color)) {
                cores_disponiveis.splice(cores_disponiveis.indexOf(vertice_adjacente.color), 1);
            }

            let cores_adjacentes = [];

            interface_vis_edges.get().filter(e => e.from == vertice_adjacente.id || e.to == vertice_adjacente.id).forEach(e => {
                let id_adjacente2 = e.from == vertice_adjacente.id ? e.to : e.from;
                let vertice_adjacente2 = interface_vis_nodes.get().filter(n => n.id == id_adjacente2)[0];

                if (!cores_adjacentes.includes(vertice_adjacente2.color)) {
                    cores_adjacentes.push(vertice_adjacente2.color);
                }
            });

            vertice_adjacente.saturacao = cores_adjacentes.length;
        });


        if (cores_disponiveis.length >= 1) {
            vertice_atual.color = cores_disponiveis[0];
        } else {
            vertice_atual.color = getColor();
            cores.push(vertice_atual.color);
        }

        vertice_atual.colored = true;

        interface_vis_nodes.update(vertice_atual);

        await new Promise(r => setTimeout(r, interface_input_speed.value));
    }

    interfaceLog('Coloração do grafo finalizada!, cores utilizadas: ' + cores.length);

    function getColor() {
        let proxima_cor = palette.filter(c => !cores.includes(c))[0];

        if (proxima_cor != undefined) {
            return proxima_cor;
        } else {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
    }
}


function interfaceRemVertice() {
    let vertice = interface_vis_network.getSelectedNodes().map(n => interface_vis_nodes.get(n))[0];
    let conexoes = interface_vis_network.getSelectedEdges().map(e => interface_vis_edges.get(e));

    grafoRemVertice(vertice);
    interface_vis_nodes.remove(vertice);

    conexoes.forEach(conexao => {
        grafoRemConexao(conexao);
        interface_vis_edges.remove(conexao);
    });

    interface_button_remover_vertice.disabled = true;
}

function interfaceRemConexao() {
    let conexao = interface_vis_network.getSelectedEdges().map(e => interface_vis_edges.get(e))[0];

    grafoRemConexao(conexao);
    interface_vis_edges.remove(conexao);

    interface_button_remover_conexao.disabled = true;
}

function interfaceCarregarArquivo(event) {

    // Reseta o grafo
    vertices.splice(0, vertices.length)
    conexoes.splice(0, conexoes.length)
    interface_vis_nodes.forEach(n => interface_vis_nodes.remove(n));
    interface_vis_edges.forEach(e => interface_vis_edges.remove(e));
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
    interface_section_log.appendChild(p_element);
    interface_section_log.scrollTop = interface_section_log.scrollHeight;
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