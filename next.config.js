/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Arquivos da marca vão junto com a rota que os entrega (fora do /public, só para quem está logado).
    outputFileTracingIncludes: {
      '/api/marca/[...caminho]': ['./conteudo/marca/**/*'],
    },
  },
  images: {
    domains: [
      'scontent.cdninstagram.com',
      'i.ytimg.com',
      'i.pinimg.com',
      'substackcdn.com',
    ],
  },
}

module.exports = nextConfig
