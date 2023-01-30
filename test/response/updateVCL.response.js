export default {
  updateVCL: {
    content: 'backend default {\n  .host = "127.0.0.1";\n  .port = "9092";\n}\n\nsub vcl_recv {\n    set req.backend = default;\n}\n\nsub vcl_hash {\n    set req.hash += req.url;\n    set req.hash += req.http.host;\n    set req.hash += "0";\n}',
    main: false,
    name: 'test-vcl',
    service_id: 'SU1Z0isxPaozGVKXdv0eY',
    version: 1,
  },
};
