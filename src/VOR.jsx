import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Hammer, Newspaper, Mail, Home, Plus, Trash2, CheckSquare, Square, X } from 'lucide-react';

// [Initialization] Firebase Configuration
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// [Style] Custom Western Fonts
const WesternStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rye&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
    
    .font-western { font-family: 'Rye', serif; }
    .font-body { font-family: 'Lora', serif; }
    
    .wood-texture {
      background-color: #d6cadd;
      background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v5.1L6 20.48V20h14v.5zm0-4V14H0v-2h20v4.5L6 15.98V15h14v1.5zM0 32l6-.5V32H0v-2h22v4l-6 .5V34H0v-2zm0-4l6-.5V28H0v-2h22v4l-6 .5V30H0v-2zM28 20l6 .5V20h6v2H28v-2zm0-4l6 .5V16h6v2H28v-2zm0-4l6 .5V28h6v2H28v-2zm0-4l6 .5V28h6v2H28v-2z' fill='%23a89f91' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E");
    }
    
    .parchment {
      background-color: #fdf6e3;
      box-shadow: inset 0 0 30px rgba(139, 69, 19, 0.15);
    }

    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }
  `}</style>
);

// [Component] Navigation Bar
const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'The Homestead', icon: Home },
    { id: 'maintenance', label: 'Chores & Fixin\'', icon: Hammer },
    { id: 'updates', label: 'Ranch News', icon: Newspaper },
    { id: 'newsletter', label: 'Post Office', icon: Mail },
  ];

  return (
    <nav className="bg-stone-800 text-amber-50 shadow-lg border-b-4 border-amber-900 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <span className="font-western text-xl md:text-2xl text-amber-500 tracking-wider">V.O. RANCH</span>
          <div className="flex space-x-1 md:space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-2 rounded-md transition-colors duration-200 flex flex-col md:flex-row items-center gap-1 md:gap-2
                  ${activeTab === tab.id ? 'bg-amber-900 text-amber-100' : 'hover:bg-stone-700 text-stone-400'}`}
              >
                <tab.icon size={18} />
                <span className="text-xs md:text-sm font-western hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// [Component] Home Section
const HomeSection = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="relative h-64 md:h-80 rounded-lg overflow-hidden border-4 border-stone-800 shadow-xl bg-stone-900 flex items-center justify-center">
        {/* Placeholder for Ranch Image - Using a CSS pattern for fallback */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-700 via-stone-900 to-black"></div>
        <div className="relative text-center p-6">
            <h1 className="font-western text-4xl md:text-6xl text-amber-100 mb-2 drop-shadow-lg">Welcome Home</h1>
            <p className="font-body text-xl text-amber-200 italic">"Honor the Land, Cherish the Kin"</p>
        </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="parchment p-6 rounded-sm border border-stone-300 shadow-md transform -rotate-1">
        <h3 className="font-western text-2xl text-stone-800 mb-4 border-b-2 border-stone-400 pb-2">Our Legacy</h3>
        <p className="font-body text-stone-700 leading-relaxed">
          Welcome to the digital hearth of the V.O. Ranch. This space is dedicated to our extended family, ensuring that the legacy we build today stands strong for the generations of tomorrow. Here we coordinate our efforts to maintain the fences, tend the grounds, and keep our shared history alive.
        </p>
      </div>
      <div className="bg-stone-800 p-6 rounded-sm border border-stone-600 shadow-md text-stone-300 transform rotate-1">
        <h3 className="font-western text-2xl text-amber-500 mb-4 border-b-2 border-stone-600 pb-2">Quick Status</h3>
        <ul className="space-y-3 font-body">
            <li className="flex justify-between border-b border-stone-700 pb-1">
                <span>Weather:</span>
                <span className="text-amber-200">Clear, 72°F</span>
            </li>
            <li className="flex justify-between border-b border-stone-700 pb-1">
                <span>Next Gathering:</span>
                <span className="text-amber-200">July 4th BBQ</span>
            </li>
            <li className="flex justify-between border-b border-stone-700 pb-1">
                <span>Main Gate:</span>
                <span className="text-green-400">Operational</span>
            </li>
             <li className="flex justify-between border-b border-stone-700 pb-1">
                <span>Water Tank:</span>
                <span className="text-yellow-400">Check Level</span>
            </li>
        </ul>
      </div>
    </div>
  </div>
);

// [Component] Maintenance Section
const MaintenanceSection = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('normal');

  // Load Tasks
  useEffect(() => {
    if (!user) return;
    
    // Using simple query as per Rule 2 (No complex indexing)
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'maintenance_tasks');
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort in memory
      tasksData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setTasks(tasksData);
    }, (error) => {
      console.error("Error fetching tasks:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !user) return;

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'maintenance_tasks'), {
        text: newTask,
        priority,
        completed: false,
        createdBy: user.uid,
        createdAt: serverTimestamp(), 
        authorName: "Family Member" // Ideally fetch this from a profile
      });
      setNewTask('');
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      const taskRef = doc(db, 'artifacts', appId, 'public', 'data', 'maintenance_tasks', id);
      await updateDoc(taskRef, { completed: !currentStatus });
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const deleteTask = async (id) => {
    // Note: window.confirm works, but in an app we might want a custom modal. 
    // For now, it is functional.
    if(!window.confirm("Are you sure you want to remove this chore?")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'maintenance_tasks', id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-stone-100 p-6 rounded-lg shadow-inner border-2 border-stone-300 mb-8">
        <h2 className="font-western text-3xl text-stone-800 mb-4 text-center">Maintenance Log</h2>
        
        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new chore..."
            className="flex-1 p-3 border-2 border-stone-400 rounded bg-white font-body focus:border-amber-600 outline-none"
          />
          <select 
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-3 border-2 border-stone-400 rounded bg-white font-body text-stone-600"
          >
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
          <button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white p-3 rounded font-western tracking-wider flex items-center justify-center gap-2 transition-colors">
            <Plus size={20} /> Add
          </button>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-center text-stone-500 italic py-4">All chores done for now. Rest easy.</p>
          )}
          {tasks.map(task => (
            <div key={task.id} className={`flex items-center gap-3 p-4 rounded border-b-2 transition-all ${task.completed ? 'bg-stone-200 border-stone-300 opacity-75' : 'bg-white border-stone-200 shadow-sm'}`}>
              <button 
                onClick={() => toggleTask(task.id, task.completed)}
                className={`flex-shrink-0 ${task.completed ? 'text-green-700' : 'text-stone-400 hover:text-amber-600'}`}
              >
                {task.completed ? <CheckSquare size={24} /> : <Square size={24} />}
              </button>
              
              <div className="flex-1">
                <p className={`font-body text-lg ${task.completed ? 'line-through text-stone-500' : 'text-stone-800'}`}>
                  {task.text}
                </p>
                <div className="flex gap-2 text-xs mt-1">
                    {task.priority === 'urgent' && !task.completed && (
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold uppercase tracking-wide">Urgent</span>
                    )}
                    <span className="text-stone-400">{task.authorName}</span>
                </div>
              </div>

              <button 
                onClick={() => deleteTask(task.id)}
                className="text-stone-300 hover:text-red-600 p-2 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// [Component] Updates Section
const UpdatesSection = () => (
  <div className="space-y-6 animate-fade-in">
    <h2 className="font-western text-3xl text-stone-800 text-center mb-8">Recent Happenings</h2>
    
    {[1, 2].map((item) => (
      <article key={item} className="bg-white p-6 rounded border border-stone-200 shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-amber-700"></div>
        <div className="ml-4">
            <span className="text-stone-400 text-sm font-western tracking-widest uppercase mb-1 block">October {12 - item}, 2023</span>
            <h3 className="text-2xl font-western text-stone-800 mb-2">
                {item === 1 ? 'New Fence Line Completed' : 'Winterizing the Barn'}
            </h3>
            <p className="font-body text-stone-600 leading-relaxed">
                {item === 1 
                    ? "Thanks to Uncle Jim and the cousins, the north pasture fence has been fully repaired. The cattle should be secure for the season. Next up: painting the shed." 
                    : "We've started moving the hay bales into the loft. Need a few more hands next weekend to finish up before the first frost hits."}
            </p>
        </div>
      </article>
    ))}
  </div>
);

// [Component] Newsletter Signup
const NewsletterSection = ({ user }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !user) return;
    
    setStatus('loading');
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'newsletter_subs'), {
        email: email,
        subscribedAt: serverTimestamp(),
        userId: user.uid
      });
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-xl mx-auto text-center animate-fade-in">
      <div className="parchment p-8 rounded-lg border-2 border-stone-300 shadow-xl relative">
        <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-amber-800"></div>
        <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-amber-800"></div>
        
        <Mail className="mx-auto text-stone-800 mb-4" size={48} />
        <h2 className="font-western text-3xl text-stone-900 mb-4">The Ranch Ledger</h2>
        <p className="font-body text-stone-700 mb-8">
          Sign up to receive monthly updates on property maintenance, family reunion dates, and general ranch news directly to your inbox.
        </p>

        {status === 'success' ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Welcome aboard!</strong>
            <span className="block sm:inline"> You've been added to the mailing list.</span>
            <button onClick={() => setStatus('idle')} className="mt-2 text-sm underline">Add another?</button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="p-3 border-2 border-stone-400 rounded bg-white font-body focus:border-amber-600 outline-none w-full"
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="bg-stone-800 text-amber-50 font-western text-lg py-3 px-6 rounded hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Scribing...' : 'Subscribe'}
            </button>
            {status === 'error' && <p className="text-red-600 text-sm mt-2">Something went wrong. Try again.</p>}
          </form>
        )}
      </div>
    </div>
  );
};

// [Component] Main App Shell
const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  // Authentication Sequence
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen wood-texture flex flex-col">
      <WesternStyles />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
            {activeTab === 'home' && <HomeSection />}
            {activeTab === 'maintenance' && <MaintenanceSection user={user} />}
            {activeTab === 'updates' && <UpdatesSection />}
            {activeTab === 'newsletter' && <NewsletterSection user={user} />}
        </div>
      </main>

      <footer className="bg-stone-900 text-stone-500 py-6 mt-8 border-t-4 border-amber-900">
        <div className="container mx-auto px-4 text-center font-body text-sm">
          <p>&copy; 2025 V.O. Ranch. Established for the Family.</p>
          <p className="mt-2 text-stone-600 text-xs">System Status: Functional</p>
        </div>
      </footer>
    </div>
  );
};

export default App;