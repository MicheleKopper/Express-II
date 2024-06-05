import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'

const app = express()

app.use(cors())

app.use(express.json())

let veiculos = []
let proximoVeiculo = 1
let usuarios = []
let proximoUsuario = 1

// ----------- POST - CRIAR VEÍCULO -------------
// http://localhost:3333/veiculos
app.post('/veiculos', (request, response) => {
    const modeloVeiculo = request.body.modeloVeiculo
    const marcaVeiculo = request.body.marcaVeiculo
    const anoVeiculo = Number(request.body.anoVeiculo)
    const corVeiculo = request.body.corVeiculo
    const precoVeiculo = Number(request.body.precoVeiculo)

    // VALIDAÇÕES
    if (!modeloVeiculo) {
        response.status(400).send('Informe o modelo do veículo!')
    }

    if (!marcaVeiculo) {
        response.status(400).send('Informe a marca do veículo!')
    }

    if (!anoVeiculo) {
        response.status(400).send('Informe o ano do veículo!')
    }

    if (!corVeiculo) {
        response.status(400).send('Informe a cor do veículo!')
    }

    if (!precoVeiculo) {
        response.status(400).send('Informe o preço do veículo!')
    }

    // CADASTRAR NOVO VEÍCULO
    let novoVeiculo = {
        id: proximoVeiculo,
        modeloVeiculo: modeloVeiculo,
        marcaVeiculo: marcaVeiculo,
        anoVeiculo: Number(anoVeiculo),
        corVeiculo: corVeiculo,
        precoVeiculo: Number(precoVeiculo)
    }

    veiculos.push(novoVeiculo)
    proximoVeiculo++

    response.status(200).send(`Veículo cadastrado com sucesso!
    Id: ${novoVeiculo.id}
    Modelo: ${modeloVeiculo}
    Marca: ${marcaVeiculo}
    Ano: ${anoVeiculo}
    Cor: ${corVeiculo}
    Preço: R$${precoVeiculo}`)
})

// ----------- GET - CONSULTAR E LER ------------
// http://localhost:3333/veiculos
app.get('/veiculos', (request, response) => {

    // VALIDAÇÃO
    // Se o tamanho dos veículos for igual a 0, vou enviar uma resposta
    if (veiculos.length === 0) {
        response.status(400).send('Não hà veículos cadastrados. Crie seu primeiro veículo!')
    }

    // MAPEAR LISTA DE VEÍCULOS CADASTRADOS
    const listaVeiculos = veiculos.map((veiculo) => `
    Id: ${veiculo.id}
    Modelo: ${veiculo.modeloVeiculo}
    Marca: ${veiculo.marcaVeiculo}
    Ano: ${veiculo.anoVeiculo}
    Cor: ${veiculo.corVeiculo}
    Preço: ${veiculo.precoVeiculo}
    `)

    // Enviando a resposta com a lista de veículos cadastrados
    response.status(200).send(`${listaVeiculos}`)
})

// ------------ GET - FILTRAR VEÍCULOS POR MARCA -----------
// http://localhost:3333/veiculos/marca
app.get('/veiculos/marca', (request, response) => {

    const { marca } = request.query
    // QUERY = para filtrar, ordenar, buscar e paginar

    // VALIDAÇÃO
    if (!marca) {
        response.status(400).send('Informe a marca para filtrar!')
    }

    const veiculosFiltrados = veiculos.filter(veiculo => veiculo.marcaVeiculo.toLowerCase() === marca.toLowerCase());
    // Um veículo selecionado dentro do array com todos os veículos. 
    // A propriedade marcaVeiculo acessa o objeto veículo, e compara se a marca é estritamente igual ao marcaVeiculo

    // Se o tamanho dos veículosFiltrados for igual a 0, vou enviar uma resposta
    if (veiculosFiltrados.length === 0) {
        response.status(404).send('Não identificado a marca do veículo!')
    }

    // MAPEAR LISTA DE VEÍCULOS FILTRADOS
    const listaVeiculos = veiculosFiltrados.map((veiculo) => `
    Id: ${veiculo.id}
    Modelo: ${veiculo.modeloVeiculo},
    Marca: ${veiculo.marcaVeiculo}
    Ano: ${veiculo.anoVeiculo}
    Cor: ${veiculo.corVeiculo}
    Preço: ${veiculo.precoVeiculo}
    `)

    // Enviar a resposta com a lista de veículos encontrados com a marca solicitada
    response.status(200).send(`Veículos encontrados: ${listaVeiculos}`)
})

// ------------ PUT - ATUALIZAR ------------
// http://localhost:3333/veiculos/:idBuscado
app.put('/veiculos/:idBuscado', (request, response) => {
    // pedir o que precisa atualizar, como não sabemos o que precisa, solicitamos tudo
    const modeloVeiculo = request.body.modeloVeiculo
    const marcaVeiculo = request.body.marcaVeiculo
    const anoVeiculo = Number(request.body.anoVeiculo)
    const corVeiculo = request.body.corVeiculo
    const precoVeiculo = Number(request.body.precoVeiculo)

    // definir o parâmetro
    const idBuscado = Number(request.params.idBuscado)
    // eu quero que ele faça uma requisoção dos parâmetros na url

    // VALIDAÇÕES DO ID
    // primeiro conferir se o parâmetro existe
    // stringif = converte um objeto para formato json

    if (!idBuscado) {
        response.status(400).send(JSON.stringify('Informe um ID válido'))
    }

    // verificar se o id existe
    const idVerificado = veiculos.findIndex(veiculo => veiculo.id === idBuscado)
    // findIndex retorna o índice no array do primeiro elemento que satisfizer o teste
    // Retorna 0 ou -1. Se der certo = 0, se der errado -1

    if (idVerificado === -1) {
        response.status(400).send(JSON.stringify('Id do veículo não encontrado'))
    }

    // VALIDAÇÕES DOS ITENS SOLICITADOS: COR E PREÇO
    if (!corVeiculo) {
        response.status(400).send(JSON.stringify('Informe a cor do veículo!'))
    }

    if (!precoVeiculo) {
        response.status(400).send(JSON.stringify('Informe o preço do veículo!'))
    }

    // VERIFICAÇÃO SE O ID EXISTE
    if (idVerificado !== -1) {
        const veiculo = veiculos[idVerificado]
        veiculo.corVeiculo = corVeiculo
        veiculo.precoVeiculo = precoVeiculo

        response.status(200).send(JSON.stringify(`Veículo atualizado com sucesso! 
        Cor: ${veiculo.corVeiculo}, 
        Preço: R$ ${veiculo.precoVeiculo}`))
    }


})

// ----------- DELETE - EXCLUIR ------------
// http://localhost:3333/veiculos/:idBuscado
app.delete('/veiculos/:idBuscado', (request, response) => {
    const idBuscado = Number(request.params.idBuscado)


    // VERIFICAR SE FOI INFORMADO O ID
    if (!idBuscado) {
        response.status(400).send(JSON.stringify({ Mensagem: 'Informe um ID válido' }))
    }

    // VERIFICAR SE O ID EXISTE NO BANCO DE DADOS
    const idVerificado = veiculos.findIndex(veiculo => veiculo.id === idBuscado)

    // SE O FINDINDEX RETORNAR -1, SIGNIFICA QUE O ID NÃO FOI ENCONTRADO
    if (idVerificado === -1) {
        response.status(400).send(JSON.stringify({ Mensagem: 'Id não encontrado!' }))
    } else {
        // SE O FINDINDEX RETORNAR VERDADEIRO (0), USAR MÉTODO SPLICE PARA EXCLUIR
        // USAR SPLICE PARA DELETAR UM OBJETO NO ARRAY 
        // array.splice(posição, quantidade, adiciona)
        veiculos.splice(idVerificado, 1)
        response.status(200).send(JSON.stringify({ Mensagem: 'Veículo deletado com sucesso!' }))
    }
}) // OBS: NO POSTMAN USAR O CAMPO 'Path Variables'

// ---------- SIGUP - CRIAR USUÁRIO ----------
// http://localhost:3333/usuario
app.post('/usuario', async (request, response) => {
    const { email, senha } = request.body;

    // VALIDAR SE FOI INSERIDO EMAIL E SENHA
    if (!email) {
        response.status(400).json({ mensagem: 'Inserir um email válido' })
    }

    if (!senha) {
        response.status(400).json({ mensagem: 'Inserir uma senha válida' })
    }

    // VERIFICAR SE O EMAIL JÁ EXISTE
    const verificarEmail = usuarios.find(usuario => usuario.email === email)

    // SE ESSE EMAIL JÁ ESTIVER CADASTRADO
    if (verificarEmail) {
        response.status(400).json({ mensagem: 'Email já cadastrado' })
    }

    // CRIPTOGRAFAR SENHA
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    console.log(senhaCriptografada) // Log para conferir se criptografou

    // CRIAR NOVO USUÁRIO
    const novoUsuario = {
        id: proximoUsuario,
        email: email,
        senhaCriptografada: senhaCriptografada
    };

    usuarios.push(novoUsuario);
    proximoUsuario++;

    response.status(201).json({ mensagem: `Usuário com email ${email} cadastrado com sucesso!` })
})

// ---------- FAZER LOGIN ----------
// http://localhost:3333/login
app.post('/login', async (request, response) => {
    const { email, senha } = request.body

    // VALIDAR SE FOI INSERIDO EMAIL E SENHA
    if (!email) {
        response.status(400).json({ mensagem: 'Inserir um email válido' })
    }

    if (!senha) {
        response.status(400).json({ mensagem: 'Inserir uma senha válida' })
    }

    // VERIFICAR SE USUÁRIO ESTÁ CADASTRADO
    const usuario = usuarios.find(usuario => usuario.email === email)

    // VERIFICAR SE A SENHA É A MESMA DA SENHA CRIPTOGRAFADA - USAR O COMPARE
    const senhaCompativel = await bcrypt.compare(senha, usuario.senhaCriptografada)

    if (!senhaCompativel) {
        response.status(400).json({ mensagem: 'Senha não encontrada em nosso banco' })
    }

    response.status(200).json({ mensagem: `Email ${email} logado com sucesso!` })


})









app.listen(3333,()=> console.log('Servidor rodando na porta 3333'))