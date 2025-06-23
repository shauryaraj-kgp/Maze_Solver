'use client';
import React from 'react';
import Link from 'next/link';
import '../styles/home.css';

export default function HomePage() {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <div className="welcome-header">
                    <h1 className="welcome-title">Maze Solver</h1>
                    <p className="welcome-subtitle">Visualize Pathfinding Algorithms</p>
                </div>

                <div className="welcome-features">
                    <h2>What You Can Do</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🧠</div>
                            <h3>Compare Algorithms</h3>
                            <p>Watch BFS, DFS, A*, and Backtracking solve the same maze</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⏱️</div>
                            <h3>Performance Tracking</h3>
                            <p>See which algorithm is fastest and most efficient</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎮</div>
                            <h3>Interactive Play</h3>
                            <p>Use arrow keys or WASD to navigate manually</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Real-time Visualization</h3>
                            <p>Watch algorithms explore and find the optimal path</p>
                        </div>
                    </div>
                </div>

                <div className="welcome-instructions">
                    <h2>How It Works</h2>
                    <ul>
                        <li>Choose from 4 different pathfinding algorithms</li>
                        <li>Generate new mazes with varying complexity</li>
                        <li>Watch algorithms solve in real-time with visual feedback</li>
                        <li>Compare performance metrics and rankings</li>
                        <li>Navigate manually using keyboard controls</li>
                        <li>Green square = Start, Red square = Goal</li>
                    </ul>
                </div>

                <Link href="/maze" className="welcome-start-btn">
                    Start Maze Solver
                </Link>
            </div>
        </div>
    );
} 