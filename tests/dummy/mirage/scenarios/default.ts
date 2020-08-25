interface Server {
    createList: (modelName: string, amount: number) => any;
}

export default function (server: Server) {
    server.createList('person', 50);
}
