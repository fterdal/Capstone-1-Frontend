import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "./CSS/IRVResults.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const IRVResults = ({ poll }) => {
  const { winnerId, lastTallies, barOrder } = useMemo(
    () => instantRunoff(poll),
    [poll]
  );

  const labels = barOrder.map(
    (id) => poll.pollOptions.find((o) => o.id === id)?.text || `#${id}`
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Votes (last round before the elimination.",
        data: barOrder.map((id) => lastTallies[id]),
        backgroundColor: barOrder.map((id) =>
          id === winnerId ? "#EB5E28" : "#CCC5B9"
        ),
        borderColor: "#252422",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    plugins: { legend: { display: false }, title: { display: false } },
    responsive: true,
  };

  const winnerText =
    poll.pollOptions.find((o) => o.id === winnerId)?.text ||
    "No data to display a current winner";

  function instantRunoff(poll) {
    if (!poll || !Array.isArray(poll.ballots) || poll.ballots.length === 0) {
      return { winnerId: null, lastTallies: {}, barOrder: [] };
    }

    const candidateIds = poll.pollOptions.map((o) => o.id);

    const ballots = poll.ballots.map((b) =>
      b.ballotRankings
        .sort((a, b) => a.rank - b.rank)
        .map((r) => r.option_id)
        .filter((id) => candidateIds.includes(id))
    );

    let active = new Set(candidateIds);
    const lastTallies = {};

    while (true) {
      const roundCounts = Object.fromEntries([...active].map((id) => [id, 0]));

      for (const ballot of ballots) {
        const firstActive = ballot.find((id) => active.has(id));
        if (firstActive !== undefined) roundCounts[firstActive] += 1;
      }

      const total = Object.values(roundCounts).reduce((a, b) => a + b, 0);

      for (const [id, count] of Object.entries(roundCounts)) {
        if (count > total / 2) {
          return composeResult(parseInt(id, 10), lastTallies, roundCounts);
        }
      }

      const minVotes = Math.min(...Object.values(roundCounts));
      const lowest = Object.entries(roundCounts)
        .filter(([_, c]) => c === minVotes)
        .map(([id]) => parseInt(id, 10));

      const eliminated = lowest.sort()[0];

      lastTallies[eliminated] = roundCounts[eliminated];
      active.delete(eliminated);

      if (active.size === 0) {
        return composeResult(null, lastTallies, roundCounts);
      }
    }
  }

  function composeResult(winnerId, lastTallies, finalRoundCounts) {
    Object.entries(finalRoundCounts).forEach(([id, count]) => {
      id = parseInt(id, 10);
      if (lastTallies[id] == null) lastTallies[id] = count;
    });

    if (winnerId !== null) lastTallies[winnerId] = finalRoundCounts[winnerId];

    const barOrder = Object.keys(lastTallies)
      .map((id) => parseInt(id, 10))
      .sort((a, b) => {
        if (a === winnerId) return -1;
        if (b === winnerId) return 1;
        return lastTallies[b] - lastTallies[a];
      });

    return { winnerId, lastTallies, barOrder };
  }

  return (
    <div className="irv-results">
      <h3>Current Winner: {winnerText}</h3>
      <p>Total ballots: {poll.ballots?.length ?? 0}</p>
      <Bar data={data} options={options} />
    </div>
  );
};

export default IRVResults;
