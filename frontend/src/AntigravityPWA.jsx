import React, { useState, useEffect } from 'react';
import api from './config/axios';
import RecyclingGame from './RecyclingGame';
import EcoQuiz from './EcoQuiz';
import MemoryGame from './MemoryGame';
import InfoSlider from './InfoSlider';

const AntigravityPWA = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState(null);
    const [view, setView] = useState('home'); // home, login, register, audiovisual, forum, games
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [documentId, setDocumentId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [forumPosts, setForumPosts] = useState([]);
    const [newForumPost, setNewForumPost] = useState({ title: '', content: '' });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }
        checkAuth();
        fetchComments();
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const checkAuth = async () => {
        try {
            const res = await api.get('/api/user');
            if (res.data.is_authenticated) {
                setUser({ username: res.data.username });
            }
        } catch (err) {
            console.log("Not logged in");
        }
    };

    const fetchComments = async () => {
        try {
            const res = await api.get('/api/comments');
            setComments(res.data);
        } catch (err) {
            console.error("Error fetching comments", err);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/login', { username, password });
            setUser({ username: res.data.username });
            setView('home');
            setError('');
            setUsername('');
            setPassword('');
        } catch (err) {
            setError('Credenciales inválidas');
        }
    };

    const handleGoogleLogin = () => {
        // Placeholder for Google Auth Logic
        // In a real app, you would use Firebase Auth or Google Identity Services here.
        // Example: signInWithPopup(auth, provider).then((result) => { ... })

        alert("Esta es una simulación de inicio de sesión con Google. Para implementar esto realmente, necesitas configurar un proyecto en Google Cloud Console y usar Firebase Auth o una librería similar.");

        setUser({ username: 'GoogleUser', name: 'Usuario de Google' });
        setView('home');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/register', { username, name, documentId, email, password });
            setError('¡Registro exitoso! Por favor inicia sesión.');
            setView('login');
            setUsername('');
            setName('');
            setDocumentId('');
            setEmail('');
            setPassword('');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error en el registro';
            setError(errorMsg);
        }
    };

    const handleLogout = async () => {
        await api.post('/api/logout');
        setUser(null);
        setView('home');
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await api.post('/api/comments', { content: newComment });
            setComments([...comments, res.data.comment]);
            setNewComment('');
        } catch (err) {
            console.error("Error posting comment", err);
        }
    };

    const handleLike = async (commentId) => {
        try {
            const res = await api.post(`/api/comments/${commentId}/like`);
            setComments(comments.map(c =>
                c.id === commentId ? { ...c, likes: res.data.likes } : c
            ));
        } catch (err) {
            console.error("Error liking comment", err);
        }
    };

    const videos = [
        { id: 'ZGfcf0D3R04', title: 'El Cambio Climático Explicado' },
        { id: 'yiw6_JakZFc', title: 'Cómo Salvar el Planeta' },
        { id: 'ipVxxxqwBQw', title: 'Energías Renovables' },
        { id: 'wbR-5mHI6bo', title: 'La Importancia de Reciclar' },
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            {/* Navigation */}
            <nav className="glass sticky top-0 z-50 px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1
                        className="text-2xl font-black text-primary tracking-tighter cursor-pointer"
                        onClick={() => setView('home')}
                    >
                        ECO<span className="text-gray-700 dark:text-gray-300">-ETITC</span>
                    </h1>

                    {/* Navigation Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => setView('home')}
                            className={`font-semibold transition-colors ${view === 'home' ? 'text-primary' : 'text-gray-600 dark:text-gray-400 hover:text-primary'}`}
                        >
                            Inicio
                        </button>
                        <button
                            onClick={() => setView('audiovisual')}
                            className={`font-semibold transition-colors ${view === 'audiovisual' ? 'text-primary' : 'text-gray-600 dark:text-gray-400 hover:text-primary'}`}
                        >
                            Audiovisual
                        </button>
                        <button
                            onClick={() => setView('forum')}
                            className={`font-semibold transition-colors ${view === 'forum' ? 'text-primary' : 'text-gray-600 dark:text-gray-400 hover:text-primary'}`}
                        >
                            Foro
                        </button>
                        <button
                            onClick={() => setView('games')}
                            className={`font-semibold transition-colors ${view === 'games' ? 'text-primary' : 'text-gray-600 dark:text-gray-400 hover:text-primary'}`}
                        >
                            Juegos
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Hamburger Menu Button (Mobile) */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle Menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        {/* Dark Mode Toggle Switch */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                            style={{ backgroundColor: darkMode ? '#10b981' : '#d1d5db' }}
                            aria-label="Toggle Dark Mode"
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>

                        {/* User info/logout - only on desktop */}
                        {user ? (
                            <div className="hidden md:flex items-center gap-4">
                                <span className="font-medium">Hola, {user.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-bold text-red-500 hover:text-red-600"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setView('login')}
                                className="hidden md:block btn-primary text-sm"
                            >
                                Ingresar
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-2">
                        <button
                            onClick={() => { setView('home'); setMobileMenuOpen(false); }}
                            className={`block w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${view === 'home' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            Inicio
                        </button>
                        <button
                            onClick={() => { setView('audiovisual'); setMobileMenuOpen(false); }}
                            className={`block w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${view === 'audiovisual' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            Audiovisual
                        </button>
                        <button
                            onClick={() => { setView('forum'); setMobileMenuOpen(false); }}
                            className={`block w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${view === 'forum' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            Foro
                        </button>
                        <button
                            onClick={() => { setView('games'); setMobileMenuOpen(false); }}
                            className={`block w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${view === 'games' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            Juegos
                        </button>

                        {/* Login/User section in mobile menu */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                            {user ? (
                                <>
                                    <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                        Hola, {user.username}
                                    </div>
                                    <button
                                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                        className="block w-full text-left px-4 py-2 rounded-lg font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        Salir
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setView('login'); setMobileMenuOpen(false); }}
                                    className="block w-full btn-primary"
                                >
                                    Ingresar
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* HOME VIEW */}
                {view === 'home' && (
                    <>
                        <InfoSlider />

                        {!user && (
                            <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-8 mb-10 text-center text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm"></div>
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black mb-4">¡Únete a la Comunidad ECO-ETITC!</h2>
                                    <p className="text-lg mb-6 max-w-2xl mx-auto">
                                        Regístrate ahora para participar en nuestros foros de debate, compartir tus ideas y competir en nuestros juegos ecológicos.
                                        ¡Tu voz es importante para el futuro del planeta!
                                    </p>
                                    <button
                                        onClick={() => setView('register')}
                                        className="px-8 py-3 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-lg"
                                    >
                                        Registrarme Ahora
                                    </button>
                                </div>
                            </div>
                        )}

                        <article className="glass-card mb-8">
                            <header className="mb-6">
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
                                    MEDIO AMBIENTE
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white mb-4 leading-tight">
                                    La Importancia del Cuidado del Medio Ambiente: Nuestro Futuro Depende de Ello
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span>Por EcoTeam</span>
                                    <span>•</span>
                                    <span>Noviembre 24, 2025</span>
                                </div>
                            </header>

                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                                <p className="text-lg mb-4">
                                    El medio ambiente es el hogar que compartimos todos los seres vivos. Cuidarlo no es solo una responsabilidad,
                                    es una necesidad urgente para garantizar la supervivencia de las generaciones futuras.
                                </p>

                                <img
                                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Naturaleza pristina"
                                    className="w-full h-64 object-cover rounded-xl my-6 shadow-md"
                                />

                                <h3 className="text-2xl font-bold text-primary mb-3">¿Por Qué Es Tan Importante?</h3>
                                <p className="mb-4">
                                    El cambio climático, la deforestación, la contaminación del aire y del agua, y la pérdida de biodiversidad
                                    son solo algunos de los desafíos ambientales que enfrentamos hoy. Estos problemas no solo afectan a la naturaleza,
                                    sino que tienen un impacto directo en nuestra salud, economía y calidad de vida.
                                </p>

                                <h3 className="text-2xl font-bold text-primary mb-3">Consecuencias de No Actuar</h3>
                                <ul className="list-disc list-inside mb-4 space-y-2">
                                    <li><strong>Cambio Climático:</strong> Aumento de temperaturas, eventos climáticos extremos y derretimiento de glaciares.</li>
                                    <li><strong>Pérdida de Biodiversidad:</strong> Extinción de especies y desequilibrio en los ecosistemas.</li>
                                    <li><strong>Contaminación:</strong> Aire y agua contaminados que afectan la salud humana.</li>
                                    <li><strong>Escasez de Recursos:</strong> Agotamiento de recursos naturales esenciales como el agua potable.</li>
                                </ul>

                                <h3 className="text-2xl font-bold text-primary mb-3">¿Qué Podemos Hacer?</h3>
                                <p className="mb-4">
                                    Cada acción cuenta. Desde reducir el uso de plásticos, reciclar, ahorrar energía, hasta apoyar energías renovables
                                    y consumir de manera responsable. Pequeños cambios en nuestros hábitos diarios pueden generar un impacto significativo.
                                </p>

                                <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-xl my-6">
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        "No heredamos la Tierra de nuestros ancestros, la tomamos prestada de nuestros hijos."
                                        <span className="block text-sm text-gray-600 dark:text-gray-400 mt-2">- Proverbio Nativo Americano</span>
                                    </p>
                                </div>

                                <p className="text-lg font-semibold">
                                    Esta plataforma tiene como objetivo educar, inspirar y movilizar a la acción. Únete a nuestra comunidad,
                                    comparte tus ideas y juntos construyamos un futuro más verde y sostenible.
                                </p>
                            </div>
                        </article>

                        {/* Second Article Section */}
                        <article className="glass-card mb-8">
                            <header className="mb-6">
                                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold mb-2">
                                    ENERGÍAS RENOVABLES
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white mb-4 leading-tight">
                                    El Futuro es Verde: Energías Renovables para un Planeta Sostenible
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span>Por EcoTeam</span>
                                    <span>•</span>
                                    <span>Noviembre 24, 2025</span>
                                </div>
                            </header>

                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                                <p className="text-lg mb-4">
                                    La transición hacia energías renovables no es solo una opción, es una necesidad urgente para combatir
                                    el cambio climático y garantizar un futuro sostenible para las próximas generaciones.
                                </p>

                                <img
                                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Paneles solares"
                                    className="w-full h-64 object-cover rounded-xl my-6 shadow-md"
                                />

                                <h3 className="text-2xl font-bold text-blue-500 mb-3">Tipos de Energías Renovables</h3>
                                <ul className="list-disc list-inside mb-4 space-y-2">
                                    <li><strong>Solar:</strong> Aprovecha la energía del sol mediante paneles fotovoltaicos.</li>
                                    <li><strong>Eólica:</strong> Utiliza la fuerza del viento para generar electricidad.</li>
                                    <li><strong>Hidroeléctrica:</strong> Genera energía a partir del movimiento del agua.</li>
                                    <li><strong>Geotérmica:</strong> Aprovecha el calor interno de la Tierra.</li>
                                    <li><strong>Biomasa:</strong> Convierte materia orgánica en energía.</li>
                                </ul>

                                <h3 className="text-2xl font-bold text-blue-500 mb-3">Beneficios de las Energías Renovables</h3>
                                <p className="mb-4">
                                    Las energías renovables reducen las emisiones de gases de efecto invernadero, disminuyen la dependencia
                                    de combustibles fósiles, crean empleos verdes y mejoran la calidad del aire. Además, son inagotables
                                    y cada vez más económicas gracias a los avances tecnológicos.
                                </p>

                                <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-xl my-6">
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        "El sol, el viento y el agua son fuentes de energía que nunca se agotarán. Invertir en renovables
                                        es invertir en nuestro futuro."
                                    </p>
                                </div>

                                <p className="text-lg font-semibold">
                                    Cada acción cuenta. Desde instalar paneles solares en casa hasta apoyar políticas de energía limpia,
                                    todos podemos contribuir a la revolución verde.
                                </p>
                            </div>
                        </article>

                        {/* Comments Section */}
                        <section className="glass-card">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Discusión de la Comunidad</h3>

                            {user ? (
                                <form onSubmit={handleCommentSubmit} className="mb-8">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Comparte tus pensamientos..."
                                        className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all mb-4"
                                        rows="3"
                                    />
                                    <button type="submit" className="btn-primary">
                                        Publicar Comentario
                                    </button>
                                </form>
                            ) : (
                                <div className="p-6 bg-primary/5 rounded-xl text-center mb-8 border border-primary/10">
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">¡Únete a la conversación!</p>
                                    <button onClick={() => setView('login')} className="text-primary font-bold hover:underline">
                                        Inicia sesión para comentar
                                    </button>
                                </div>
                            )}

                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                                                    {comment.username[0].toUpperCase()}
                                                </div>
                                                <span className="font-bold text-sm text-gray-700 dark:text-gray-200">{comment.username}</span>
                                            </div>
                                            <button
                                                onClick={() => handleLike(comment.id)}
                                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                                                aria-label="Me gusta"
                                            >
                                                <span className="text-lg">❤️</span>
                                                <span className="text-sm font-bold text-primary">{comment.likes || 0}</span>
                                            </button>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{comment.content}</p>
                                    </div>
                                ))}
                                {comments.length === 0 && (
                                    <p className="text-center text-gray-500 italic">No hay comentarios aún. ¡Sé el primero!</p>
                                )}
                            </div>
                        </section>
                    </>
                )}

                {/* AUDIOVISUAL VIEW */}
                {view === 'audiovisual' && (
                    <div>
                        <div className="glass-card mb-8">
                            <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-4">
                                🎥 Contenido Audiovisual
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Explora estos videos educativos sobre el cuidado del medio ambiente y la importancia de la sostenibilidad.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {videos.map((video) => (
                                <div key={video.id} className="glass-card">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">{video.title}</h3>
                                    <div className="aspect-video rounded-xl overflow-hidden">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${video.id}`}
                                            title={video.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FORUM VIEW */}
                {view === 'forum' && (
                    <div>
                        <div className="glass-card mb-8">
                            <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-4">
                                💬 Foro de Discusión
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Comparte tus ideas, experiencias y preguntas sobre el cuidado del medio ambiente.
                            </p>

                            {user ? (
                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Crear Nueva Publicación</h3>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        if (newForumPost.title.trim() && newForumPost.content.trim()) {
                                            setForumPosts([
                                                { id: Date.now(), ...newForumPost, username: user.username, date: new Date().toLocaleDateString() },
                                                ...forumPosts
                                            ]);
                                            setNewForumPost({ title: '', content: '' });
                                        }
                                    }}>
                                        <input
                                            type="text"
                                            placeholder="Título de tu publicación..."
                                            value={newForumPost.title}
                                            onChange={(e) => setNewForumPost({ ...newForumPost, title: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all mb-3"
                                            required
                                        />
                                        <textarea
                                            placeholder="Escribe tu mensaje..."
                                            value={newForumPost.content}
                                            onChange={(e) => setNewForumPost({ ...newForumPost, content: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all mb-3"
                                            rows="4"
                                            required
                                        />
                                        <button type="submit" className="btn-primary">
                                            Publicar en el Foro
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="p-6 bg-primary/5 rounded-xl text-center border border-primary/10">
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">¡Únete al foro!</p>
                                    <button onClick={() => setView('login')} className="text-primary font-bold hover:underline">
                                        Inicia sesión para participar
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Forum Posts */}
                        <div className="space-y-6">
                            {forumPosts.map((post) => (
                                <div key={post.id} className="glass-card">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold">
                                            {post.username[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{post.title}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">{post.username}</span>
                                                <span>•</span>
                                                <span>{post.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{post.content}</p>
                                </div>
                            ))}
                            {forumPosts.length === 0 && (
                                <div className="glass-card text-center py-12">
                                    <p className="text-gray-500 italic">No hay publicaciones aún. ¡Sé el primero en compartir!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* GAMES VIEW */}
                {view === 'games' && (
                    <div>
                        <div className="glass-card mb-8">
                            <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-4">
                                🎮 Juegos Ambientales
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Aprende sobre el medio ambiente mientras te diviertes con estos juegos interactivos.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <RecyclingGame />
                            <EcoQuiz />
                            <div className="lg:col-span-2">
                                <MemoryGame />
                            </div>
                        </div>
                    </div>
                )}

                {/* LOGIN/REGISTER VIEW */}
                {(view === 'login' || view === 'register') && (
                    <div className="max-w-md mx-auto mt-10">
                        <div className="glass-card">
                            <h2 className="text-2xl font-black text-center mb-6 text-primary">
                                {view === 'login' ? 'BIENVENIDO DE NUEVO' : 'ÚNETE AL MOVIMIENTO'}
                            </h2>
                            {error && (
                                <div className={`${error.includes('exitoso') ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded relative mb-4 border`} role="alert">
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}
                            <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                                        Nombre de Usuario
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        required
                                    />
                                </div>
                                {view === 'register' && (
                                    <>
                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
                                                Nombre Completo
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="documentId">
                                                Documento de Identidad
                                            </label>
                                            <input
                                                id="documentId"
                                                type="text"
                                                value={documentId}
                                                onChange={(e) => setDocumentId(e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                                                Correo Electrónico
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                                        Contraseña
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full btn-primary mt-4">
                                    {view === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                                </button>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">O continúa con</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 4.66c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Google</span>
                            </button>

                            <div className="mt-6 text-center text-sm">
                                <button
                                    onClick={() => {
                                        setView(view === 'login' ? 'register' : 'login');
                                        setError('');
                                    }}
                                    className="text-gray-500 hover:text-primary transition-colors"
                                >
                                    {view === 'login' ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                                </button>
                            </div>
                            <button
                                onClick={() => setView('home')}
                                className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600"
                            >
                                ← Volver al Inicio
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AntigravityPWA;
