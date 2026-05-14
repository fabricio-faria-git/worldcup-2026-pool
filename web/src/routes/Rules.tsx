import { AppLayout, Card } from '../components';

export const Rules = () => {
  return (
    <AppLayout>
      <div className="pt-8 px-4 pb-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Regras</h1>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Prazo para os palpites
          </h2>
          <div className="flex items-start gap-3 text-white/80">
            <span className="text-2xl">⏰</span>
            <p>
              Os Palpites devem serem feitos{' '}
              <span className="text-white font-semibold">
                até 10 minutos antes do início do jogo.
              </span>
              <br />
			  Depois disso, os palpites são bloqueados e não podem ser alterados.
            </p>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Como os pontos são calculados
          </h2>

          <div className="space-y-4 text-white/80">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🥳</span>
              <div>
                <h3 className="font-semibold text-white">
                  Placar exato — 15 pontos
                </h3>
                <p className="text-sm">
                  Preveja o placar final exato de ambas as equipes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">😄</span>
              <div>
                <h3 className="font-semibold text-white">
                  Resultado correto — até 10 pontos
                </h3>
                <p className="text-sm">
                  Preveja o vencedor correto (ou empate), mas não o placar exato.
Pontos = 10 menos a diferença entre os placares reais.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">😔</span>
              <div>
                <h3 className="font-semibold text-white">
                  Resultado incorreto — 0 pontos
                </h3>
                <p className="text-sm">
                  Preveja o vencedor errado ou erre o empate.
                </p>
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-xl font-semibold text-white mb-4">
            Examplos
          </h2>

          <div className="space-y-6">
            {/* Example 1: Exact score */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <span className="text-white/60 text-sm">Resultado real</span>
                <span className="text-white font-mono">
                  México 2 - 1 Africa do Sul
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <span className="text-white/60 text-sm">Seu Palpite</span>
                <span className="text-white font-mono">
                  México 2 - 1 Africa do Sul
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="text-white/60 text-sm">Pontos Ganhos</span>
                <span className="text-green-400 font-bold">
                  🥳 15 pontos (Exato!)
                </span>
              </div>
            </div>

            {/* Example 2: Correct winner */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <span className="text-white/60 text-sm">Resultado real</span>
                <span className="text-white font-mono">
                  Brasil 2 - 1 Marrocos
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <span className="text-white/60 text-sm">Seu Palpite</span>
                <span className="text-white font-mono">
                  Brasil 3 - 0 Marrocos
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="text-white/60 text-sm">Pontos Ganhos</span>
                <div className="md:text-right">
                  <span className="text-yellow-400 font-bold">😄 8 pontos</span>
                  <div className="text-white/40 text-xs font-mono">
                    10 - |3-2| - |0-1| = 8
                  </div>
                </div>
              </div>
            </div>

            {/* Example 3: Correct draw */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <span className="text-white/60 text-sm">Resultado real</span>
                <span className="text-white font-mono">
                  Holanda 2 - 2 Japão
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <span className="text-white/60 text-sm">Seu Palpite</span>
                <span className="text-white font-mono">
                  Holanda 0 - 0 Japão
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="text-white/60 text-sm">Pontos Ganhos</span>
                <div className="md:text-right">
                  <span className="text-yellow-400 font-bold">😄 6 pontos</span>
                  <div className="text-white/40 text-xs font-mono">
                    10 - |0-2| - |0-2| = 6
                  </div>
                </div>
              </div>
            </div>

            {/* Example 4: Wrong result */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <span className="text-white/60 text-sm">Pontos Ganhost</span>
                <span className="text-white font-mono">
                  England 2 - 1 Croatia
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <span className="text-white/60 text-sm">Seu Palpite</span>
                <span className="text-white font-mono">
                  England 0 - 2 Croatia
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="text-white/60 text-sm">Pontos GanhosPontos</span>
                <span className="text-red-400 font-bold">
                  😔 0 Pontos (Vencedor errado)
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};
