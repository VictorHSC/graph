function Grafo(nome, verticeInicial) {
    this.nome = nome;
    this.verticeInicial;

    if(verticeInicial && verticeInicial.constructor == (new Vertice()).constructor) {
        this.verticeInicial = verticeInicial;
    } else {
        this.verticeInicial = new Vertice("Vertice Inicial");
    }

    console.log(this);
}

Grafo.prototype.setVerticeInicial = function (vertice) {
    this.verticeInicial = vertice;
}

function Vertice(descricao) {
    this.descricao = descricao;

    console.log(this);
}

function Aresta(verticeA, verticeB) {

    console.log(this);
}

