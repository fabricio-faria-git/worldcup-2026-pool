import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppLayout,
  Card,
  Button,
  LinkButton,
  LeaguePicture,
} from '../components';
import { useAuth, useLeague } from '../hooks';
import appIcon from '/app-icon.png';
import {
  subscribeToUserLeagues,
  joinLeague,
  getLeagueByInviteCode,
  type LeagueWithId,
} from '../services';


export const Leagues = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedLeague } = useLeague();
  const [leagues, setLeagues] = React.useState<LeagueWithId[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showJoin, setShowJoin] = React.useState(false);
  const [inviteCode, setInviteCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [joining, setJoining] = React.useState(false);

  React.useEffect(() => {

 
  if (!user) {
    console.log("SEM USER")

    setLoading(false)
    return
  }

  try{

    const unsubscribe=
      subscribeToUserLeagues(
        user.uid,
        (userLeagues)=>{

          console.log(
            "LIGAS RECEBIDAS",
            userLeagues
          )

          setLeagues(
            userLeagues || []
          )

          setLoading(false)

        }
      )

    // segurança:
    setTimeout(()=>{

      console.log(
        "TIMEOUT DE SEGURANÇA"
      )

      setLoading(false)

    },5000)

    return ()=>unsubscribe()

  }catch(e){

    console.error(
      "ERRO LEAGUES",
      e
    )

    setLoading(false)

  }

},[user]);

  const handleJoinLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteCode.trim()) return;

    setJoining(true);
    setError(null);

    try {
      const league = await getLeagueByInviteCode(inviteCode.trim());
      if (!league) {
        setError('Invalid invite code');
        return;
      }

      await joinLeague(league.id, user.uid);
      setSelectedLeague(league);
      setInviteCode('');
      setShowJoin(false);
      void navigate(`/league/${league.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join league');
    } finally {
      setJoining(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors';

  return (
    <AppLayout>
      <div className="pt-8 px-4 pb-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Minhas Ligas</h1>
          {user && (
            <div className="flex gap-2">
              <Button onClick={() => setShowJoin(true)} className="text-sm">
                Entrar
              </Button>
              <LinkButton to="/leagues/new" className="text-sm">
                Criar
              </LinkButton>
            </div>
          )}
        </div>

        {!user && (
          <Card className="mb-6 p-6 text-center">
            <p className="text-white/70">Faça login para criar ou participar de ligas.</p>
          </Card>
        )}

        {/* Join League Modal */}
        {showJoin && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Join League
            </h2>
            <form onSubmit={(e) => void handleJoinLeague(e)}>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Enter invite code"
                className={`${inputClass} uppercase tracking-widest text-center font-mono`}
                maxLength={6}
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              <div className="flex gap-3 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowJoin(false);
                    setError(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={joining || inviteCode.length < 6}
                  className="flex-1"
                >
                  {joining ? 'Joining...' : 'Join'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Leagues List */}
        {loading ? (
          <div className="text-center text-white/70 py-20">Loading...</div>
        ) : (
          <div className="space-y-3">
            {/* Global League */}
            <button
              onClick={() => {
                void setSelectedLeague(null);
                void navigate('/leaderboard');
              }}
              className="w-full text-left hover:cursor-pointer"
            >
              <Card className="p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <img
                    src={appIcon}
                    alt="Global"
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">
                      Bolão Copa 2026
                    </h3>
                    <p className="text-white/80 text-sm">Classificação Geral</p>
                  </div>
                  <span className="text-white/80">→</span>
                </div>
              </Card>
            </button>

            {/* No leagues message */}
            {leagues.length === 0 && user && (
              <Card className="p-6 text-center">
                <p className="text-white/80 mb-4">
                  Você ainda não entrou em nenhuma liga
                </p>
                <p className="text-white/80 text-sm">
                  Crie sua própria liga ou participe de uma com um código de convite.
                </p>
              </Card>
            )}

            {/* User's Leagues */}
            {leagues.map((league) => (
              <button
                key={league.id}
                onClick={() => {
                  void setSelectedLeague(league);
                  void navigate(`/league/${league.slug}`);
                }}
                className="w-full text-left hover:cursor-pointer"
              >
                <Card className="p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <LeaguePicture
                      src={league.imageURL}
                      name={league.name}
                      size="md"
                      className="shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {league.name}
                      </h3>
                      <p className="text-white/50 text-sm">
                        {league.memberCount}{' '}
                        {league.memberCount === 1 ? 'Membro' : 'Membros'}
                      </p>
                    </div>
                    <span className="text-white/30">→</span>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};
