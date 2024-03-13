//Matriz

var matriz = [];
var tamanho = 9;
//Função de input/output será via 'web'

const letterMap = [{ id: 0, letter: 'A' },
{ id: 1, letter: 'B' },
{ id: 2, letter: 'C' },
{ id: 3, letter: 'D' },
{ id: 4, letter: 'E' },
{ id: 5, letter: 'F' },
{ id: 6, letter: 'G' },
{ id: 7, letter: 'H' },
{ id: 8, letter: 'I' },
{ id: 9, letter: 'J' },
{ id: 10, letter: 'K' },
{ id: 11, letter: 'L' },
{ id: 12, letter: 'M' },
{ id: 13, letter: 'N' },
{ id: 14, letter: 'O' },
{ id: 15, letter: 'P' },
{ id: 16, letter: 'Q' },
{ id: 17, letter: 'R' },
{ id: 18, letter: 'S' },
{ id: 19, letter: 'T' },
{ id: 20, letter: 'U' },
{ id: 21, letter: 'V' },
{ id: 22, letter: 'W' },
{ id: 23, letter: 'X' },
{ id: 24, letter: 'Y' },
{ id: 25, letter: 'Z' }]

function inicializarMatriz() {
    for (i = 0; i < tamanho; i++) {
        matriz[i] = [];
        adicionarVertice(i, letterMap[i].letter);
        for (j = 0; j < tamanho; j++) {
            matriz[i][j] = 0;
        }
    }
}

function adicionarArco(verticeA, verticeB) {
    matriz[verticeA][verticeB] = 1;
}

function _adicionarAresta(verticeA, verticeB) {
    adicionarAresta(verticeA, verticeB);
    adicionarArco(verticeA, verticeB);
    adicionarArco(verticeB, verticeA);
}

function proximoNaoVisitado(visitados) {
    for (i = 0; i < tamanho; i++) {
        if (visitados[i] == undefined) {
            return i;
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function DFS(inicio = 0) {
    let pilha = [];
    let visitados = [];

    pilha.push(inicio);

    var intr = setInterval(() => {
        inicio = pilha.pop();

        if (visitados[inicio] == undefined) {
            console.log("Percorrido ", inicio + 1);
            visitando(inicio);
            visitados[inicio] = 1;
            matriz[inicio].forEach(function (valor, chave) {
                if (valor == 1) {
                    pilha.push(chave);
                }
            });
        }
        if (pilha.length == 0 && visitados.reduce((a, c) => { return a + (c || 0) }) < tamanho) {
            pilha.push(proximoNaoVisitado(visitados));
        }

        if (pilha.length <= 0) {
            clearInterval(intr);
            console.log("finished");
        } 
    }, 1000);
}

inicializarMatriz();

_adicionarAresta(letterMap.find(l => l.letter == 'A').id, letterMap.find(l => l.letter == 'E').id);
_adicionarAresta(letterMap.find(l => l.letter == 'A').id, letterMap.find(l => l.letter == 'I').id);
_adicionarAresta(letterMap.find(l => l.letter == 'A').id, letterMap.find(l => l.letter == 'F').id);
_adicionarAresta(letterMap.find(l => l.letter == 'A').id, letterMap.find(l => l.letter == 'G').id);

_adicionarAresta(letterMap.find(l => l.letter == 'E').id, letterMap.find(l => l.letter == 'F').id);
_adicionarAresta(letterMap.find(l => l.letter == 'E').id, letterMap.find(l => l.letter == 'I').id);

_adicionarAresta(letterMap.find(l => l.letter == 'I').id, letterMap.find(l => l.letter == 'F').id);

_adicionarAresta(letterMap.find(l => l.letter == 'G').id, letterMap.find(l => l.letter == 'B').id);

_adicionarAresta(letterMap.find(l => l.letter == 'C').id, letterMap.find(l => l.letter == 'H').id);

_adicionarAresta(letterMap.find(l => l.letter == 'H').id, letterMap.find(l => l.letter == 'D').id);
