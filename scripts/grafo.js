/**
 * 
 * Array que armazena os vértices do grafo.
 * 
 * @example
 * [{
 *  id: 0, // id do vértice
 *  descricao: "Vértice A" // descrição do vértice
 * }, {
 *  id: 1, // id do vértice
 *  descricao: "Vértice B" // descrição do vértice
 * }]
 */
const vertices = [];

/**
 * Array que armazena as conexoes do grafo.
 * 
 * @example
 * [{
 *  id_origem: 0, // id do vértice de origem da conexao
 *  id_destino: 1 // id do vértice de destino da conexao
 * }]
 */
const conexoes = [];

// Matriz de Adjacencia
var matrizAdjacencia = [];

/**
 * 
 * @param {*} vertice 
 * @returns 
 */
function grafoAddVertice(id, descricao) {

    if (id == undefined || typeof id !== 'number' || id < 0)
        return console.error("atributo 'id' do vértice vazio ou inválido!", id);

    if (descricao == undefined || typeof descricao !== 'string' || descricao == '')
        return console.error("atributo 'descricao' do vértice vazio ou inválido!", descricao);

    if (vertices.find(v => v.id == id))
        return console.info("Vértice já existente!");

    let novo_vertice = {
        id,
        descricao
    }

    return vertices.push(novo_vertice) && novo_vertice;
}

function grafoAddConexao(id_origem, id_destino, tipo) {

    if (id_origem == undefined || typeof id_origem !== 'number' || id_origem < 0)
        return console.error("atributo 'id_origem' do vértice vazio ou inválido!", id_origem);

    if (id_destino == undefined || typeof id_destino !== 'number' || id_destino < 0)
        return console.error("atributo 'id_destino' do vértice vazio ou inválido!", id_destino);

    if (conexoes.find(c => c.id_origem == id_origem && c.id_destino == id_destino))
        return console.info("Arco já existente!");

    let nova_conexao = {
        id_origem,
        id_destino,
        tipo: tipo
    }

    return conexoes.push(nova_conexao) && nova_conexao;
}

function grafoAtualizarMatrizAdjacencia() {
    matrizAdjacencia = [];

    for (i = 0; i < vertices.length; i++) {
        matrizAdjacencia[i] = [];
        for (j = 0; j < vertices.length; j++) {
            matrizAdjacencia[i][j] = 0;
        }
    }

    conexoes.forEach(conexao => {
        matrizAdjacencia[conexao.id_origem][conexao.id_destino] = 1;
        if (conexao.tipo == 'aresta')
            matrizAdjacencia[conexao.id_destino][conexao.id_origem] = 1;
    });
}

function grafoBuscaLargura(id_vertice) {
    let fila = [];
    let visitados = [];

    let id_vertice_inicial = typeof id_vertice === "number" && id_vertice || vertices[0].id;

    //log 
    let count = 1;
    interfaceLog("Iniciando busca por Largura:");

    bfs(id_vertice_inicial);

    while (visitados.length < vertices.length) {
        id_vertice_inicial = vertices.find(vertice => !visitados.includes(vertice.id)).id;

        bfs(id_vertice_inicial);
    }

    function bfs(vertice_inicial) {
        fila.push(vertice_inicial);
        while (fila.length) {
            vertice = fila.shift();

            if (!visitados.includes(vertice)) {
                visitados.push(vertice);
                interfaceLog(count + " - Visitado: " + vertices.find(v => v.id == vertice).descricao);
                count++;

                let id_vertices_adjacentes = grafoObterIdVerticesAdjacentes(vertice);
                id_vertices_adjacentes.sort((a, b) => a > b).forEach(id => {
                    fila.push(id);
                });
            }
        }
    }
}

function grafoBuscaProfundidade(id_vertice) {
    let visitados = [];

    let id_vertice_inicial = typeof id_vertice === "number" && id_vertice || vertices[0].id;

    //log 
    let count = 1;
    interfaceLog("Iniciando busca por Profundidade:");

    dfs(id_vertice_inicial);

    while (visitados.length < vertices.length) {
        id_vertice_inicial = vertices.find(vertice => !visitados.includes(vertice.id)).id;

        dfs(id_vertice_inicial);
    }

    function dfs(vertice_inicial) {
        visitados.push(vertice_inicial);
        interfaceLog(count + " - Visitado: " + vertices.find(v => v.id == vertice_inicial).descricao);
        count++;
        let id_vertices_adjacentes = grafoObterIdVerticesAdjacentes(vertice_inicial);
        id_vertices_adjacentes.sort((a, b) => a > b).forEach(id => {
            if (!visitados.includes(id))
                dfs(id);
        });
    }
}

function grafoObterIdVerticesAdjacentes(id_vertice_inicial) {
    let id_vertices_adjacentes = [];

    conexoes.forEach(conexao => {
        if (conexao.id_origem == id_vertice_inicial)
            id_vertices_adjacentes.push(conexao.id_destino);

        if (conexao.id_destino == id_vertice_inicial)
            id_vertices_adjacentes.push(conexao.id_origem);
    });

    return id_vertices_adjacentes;
}

function grafoRemVertice(vertice) {
    vertices.splice(vertices.indexOf(vertices.find(v => v.id == vertice.id)), 1);
}

function grafoRemConexao(conexao) {
    conexoes.splice(conexoes.indexOf(conexoes.find(c => c.id_origem == conexao.id_origem && c.id_destino == conexao.id_destino)), 1);
}

function grafoGetFechoTransitivoDireto(id_vertice) {
    grafoAtualizarMatrizAdjacencia();

    let fecho_transitivo = [];
    for (let i = 0; i < matrizAdjacencia.length; i++) {
        fecho_transitivo[i] = undefined;
    }

    let estudado = [id_vertice];
    fecho_transitivo[id_vertice] = 0;

    rec(id_vertice);

    function rec(id, count = 1) {
        for (let j = 0; j < matrizAdjacencia.length; j++) {
            if (matrizAdjacencia[id][j] == 1) {
                if (!estudado.includes(j) || fecho_transitivo[j] > count) {
                    estudado.push(j);
                    fecho_transitivo[j] = count;
                    rec(j, count + 1);
                }
            }
        }
    }

    return fecho_transitivo;
}

function grafoGetFechoTransitivoInverso(id_vertice) {
    grafoAtualizarMatrizAdjacencia();

    let fecho_transitivo = [];
    for (let i = 0; i < matrizAdjacencia.length; i++) {
        fecho_transitivo[i] = undefined;
    }

    let estudado = [id_vertice];
    fecho_transitivo[id_vertice] = 0;

    rec(id_vertice);

    function rec(id, count = 1) {
        for (let i = 0; i < matrizAdjacencia.length; i++) {
            if (matrizAdjacencia[i][id] == 1) {
                if (!estudado.includes(i) || fecho_transitivo[i] > count) {
                    estudado.push(i);
                    fecho_transitivo[i] = count;
                    rec(i, count + 1);
                }
            }
        }
    }

    return fecho_transitivo;
}