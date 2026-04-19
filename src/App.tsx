import { useState } from "react";

type SolutionResult =
  | { type: "two"; x1: number; x2: number; delta: number }
  | { type: "one"; x: number; delta: number }
  | { type: "none"; delta: number }
  | { type: "linear"; x: number }
  | { type: "all" }
  | { type: "no_solution" }
  | null;

function formatNum(n: number): string {
  // Hiển thị số đẹp, làm tròn đến 6 chữ số thập phân
  const rounded = parseFloat(n.toFixed(6));
  return rounded.toString();
}

function solve(a: number, b: number, c: number): SolutionResult {
  if (a === 0) {
    // Phương trình bậc 1: bx + c = 0
    if (b === 0) {
      if (c === 0) return { type: "all" };
      return { type: "no_solution" };
    }
    return { type: "linear", x: -c / b };
  }

  const delta = b * b - 4 * a * c;

  if (delta > 0) {
    const x1 = (-b + Math.sqrt(delta)) / (2 * a);
    const x2 = (-b - Math.sqrt(delta)) / (2 * a);
    return { type: "two", x1, x2, delta };
  } else if (delta === 0) {
    const x = -b / (2 * a);
    return { type: "one", x, delta };
  } else {
    return { type: "none", delta };
  }
}

function renderEquation(a: number, b: number, c: number) {
  const parts: string[] = [];

  if (a === 1) parts.push("x²");
  else if (a === -1) parts.push("-x²");
  else if (a !== 0) parts.push(`${a}x²`);

  if (b > 0) parts.push(`+ ${b}x`);
  else if (b < 0) parts.push(`- ${Math.abs(b)}x`);
  else if (a !== 0 && b === 0) {
    // skip
  } else if (a === 0 && b !== 0) parts.push(`${b}x`);

  if (c > 0) parts.push(`+ ${c}`);
  else if (c < 0) parts.push(`- ${Math.abs(c)}`);
  else if (parts.length === 0) parts.push("0");

  if (parts.length === 0) parts.push("0");

  return parts.join(" ") + " = 0";
}

export default function App() {
  const [aStr, setAStr] = useState("");
  const [bStr, setBStr] = useState("");
  const [cStr, setCStr] = useState("");
  const [result, setResult] = useState<SolutionResult>(null);
  const [error, setError] = useState("");
  const [solved, setSolved] = useState(false);

  const handleSolve = () => {
    setError("");
    setSolved(false);
    setResult(null);

    const a = parseFloat(aStr);
    const b = parseFloat(bStr);
    const c = parseFloat(cStr);

    if (aStr.trim() === "" || bStr.trim() === "" || cStr.trim() === "") {
      setError("⚠️ Vui lòng nhập đầy đủ các hệ số a, b, c!");
      return;
    }
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setError("⚠️ Các hệ số phải là số hợp lệ!");
      return;
    }

    const res = solve(a, b, c);
    setResult(res);
    setSolved(true);
  };

  const handleReset = () => {
    setAStr("");
    setBStr("");
    setCStr("");
    setResult(null);
    setError("");
    setSolved(false);
  };

  const aVal = parseFloat(aStr) || 0;
  const bVal = parseFloat(bStr) || 0;
  const cVal = parseFloat(cStr) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full opacity-5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg shadow-blue-500/40 mb-4">
            <span className="text-white text-3xl font-bold">∑</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Giải Phương Trình Bậc 2
          </h1>
          <p className="text-blue-300 text-sm">
            Dạng tổng quát:{" "}
            <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-cyan-300">
              ax² + bx + c = 0
            </span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Formula preview */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-white/10 px-6 py-4 text-center">
            <p className="text-white/50 text-xs mb-1 uppercase tracking-wider">Phương trình</p>
            <p className="text-white font-mono text-xl font-semibold tracking-wide">
              {aStr || bStr || cStr
                ? renderEquation(aVal, bVal, cVal)
                : <span className="text-white/30">ax² + bx + c = 0</span>
              }
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Inputs */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Hệ số a", val: aStr, set: setAStr, placeholder: "vd: 1", sublabel: "(x²)" },
                { label: "Hệ số b", val: bStr, set: setBStr, placeholder: "vd: -5", sublabel: "(x)" },
                { label: "Hệ số c", val: cStr, set: setCStr, placeholder: "vd: 6", sublabel: "(hằng số)" },
              ].map(({ label, val, set, placeholder, sublabel }) => (
                <div key={label} className="group">
                  <label className="block text-xs font-semibold text-blue-300 mb-1">
                    {label}
                    <span className="text-white/40 ml-1">{sublabel}</span>
                  </label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => {
                      set(e.target.value);
                      setSolved(false);
                      setError("");
                    }}
                    placeholder={placeholder}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-3 py-3 text-center text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all hover:bg-white/15"
                    onKeyDown={(e) => e.key === "Enter" && handleSolve()}
                  />
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 text-red-300 text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSolve}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-95 text-lg"
              >
                🔍 Giải phương trình
              </button>
              <button
                onClick={handleReset}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 active:scale-95"
                title="Làm mới"
              >
                ↺
              </button>
            </div>

            {/* Result */}
            {solved && result && (
              <div className="mt-2 animate-[fadeInUp_0.4s_ease-out]">
                <ResultCard result={result} a={aVal} b={bVal} c={cVal} />
              </div>
            )}
          </div>
        </div>

        {/* Steps section */}
        {solved && result && (
          <StepsSection result={result} a={aVal} b={bVal} c={cVal} />
        )}

        <p className="text-center text-white/30 text-xs mt-6">
          Sử dụng công thức nghiệm: x = (-b ± √Δ) / 2a &nbsp;|&nbsp; Δ = b² - 4ac
        </p>
      </div>
    </div>
  );
}

function ResultCard({
  result,
  a,
  b,
  c,
}: {
  result: SolutionResult;
  a: number;
  b: number;
  c: number;
}) {
  if (!result) return null;

  if (result.type === "all") {
    return (
      <div className="bg-green-500/20 border border-green-500/40 rounded-2xl p-4 text-center">
        <div className="text-4xl mb-2">♾️</div>
        <p className="text-green-300 font-bold text-lg">Phương trình có vô số nghiệm</p>
        <p className="text-white/50 text-sm mt-1">0 = 0 (thỏa mãn với mọi x)</p>
      </div>
    );
  }

  if (result.type === "no_solution") {
    return (
      <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-4 text-center">
        <div className="text-4xl mb-2">🚫</div>
        <p className="text-red-300 font-bold text-lg">Phương trình vô nghiệm</p>
        <p className="text-white/50 text-sm mt-1">Không tồn tại giá trị x thỏa mãn</p>
      </div>
    );
  }

  if (result.type === "linear") {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-2xl p-4 text-center">
        <div className="text-2xl mb-2">📐</div>
        <p className="text-yellow-300 font-semibold text-sm mb-2">
          a = 0 → Phương trình bậc nhất: {b}x + {c} = 0
        </p>
        <div className="bg-white/10 rounded-xl px-4 py-3 inline-block">
          <p className="text-white font-mono text-2xl font-bold">
            x = {formatNum(result.x)}
          </p>
        </div>
      </div>
    );
  }

  if (result.type === "two") {
    return (
      <div className="bg-green-500/15 border border-green-500/40 rounded-2xl p-4">
        <div className="text-center mb-3">
          <span className="inline-block bg-green-500/30 text-green-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            ✅ Phương trình có 2 nghiệm phân biệt
          </span>
        </div>
        <div className="bg-white/10 rounded-xl px-4 py-2 text-center mb-2">
          <span className="text-white/50 text-xs">Δ = </span>
          <span className="text-cyan-300 font-mono font-bold">{formatNum(result.delta)}</span>
          <span className="text-green-400 ml-2 text-xs">(Δ &gt; 0)</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center border border-cyan-500/30">
            <p className="text-cyan-400 text-xs font-semibold mb-1">Nghiệm x₁</p>
            <p className="text-white font-mono text-2xl font-bold">{formatNum(result.x1)}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center border border-purple-500/30">
            <p className="text-purple-400 text-xs font-semibold mb-1">Nghiệm x₂</p>
            <p className="text-white font-mono text-2xl font-bold">{formatNum(result.x2)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (result.type === "one") {
    return (
      <div className="bg-blue-500/20 border border-blue-500/40 rounded-2xl p-4 text-center">
        <div className="mb-3">
          <span className="inline-block bg-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            🎯 Phương trình có nghiệm kép
          </span>
        </div>
        <div className="bg-white/10 rounded-xl px-4 py-2 text-center mb-3">
          <span className="text-white/50 text-xs">Δ = </span>
          <span className="text-cyan-300 font-mono font-bold">{formatNum(result.delta)}</span>
          <span className="text-blue-400 ml-2 text-xs">(Δ = 0)</span>
        </div>
        <div className="bg-white/10 rounded-xl px-6 py-3 inline-block border border-blue-500/30">
          <p className="text-white/50 text-xs mb-1">x₁ = x₂</p>
          <p className="text-white font-mono text-2xl font-bold">{formatNum(result.x)}</p>
        </div>
      </div>
    );
  }

  if (result.type === "none") {
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-result.delta) / (2 * Math.abs(a));
    return (
      <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-4 text-center">
        <div className="mb-3">
          <span className="inline-block bg-red-500/30 text-red-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            ❌ Phương trình vô nghiệm thực
          </span>
        </div>
        <div className="bg-white/10 rounded-xl px-4 py-2 text-center mb-2">
          <span className="text-white/50 text-xs">Δ = </span>
          <span className="text-red-300 font-mono font-bold">{formatNum(result.delta)}</span>
          <span className="text-red-400 ml-2 text-xs">(Δ &lt; 0)</span>
        </div>
        {/* Complex roots */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-white/5 rounded-xl px-4 py-3 text-center border border-white/10">
            <p className="text-white/40 text-xs font-semibold mb-1">Nghiệm phức x₁</p>
            <p className="text-white/60 font-mono text-sm">
              {formatNum(realPart)} + {formatNum(imagPart)}i
            </p>
          </div>
          <div className="bg-white/5 rounded-xl px-4 py-3 text-center border border-white/10">
            <p className="text-white/40 text-xs font-semibold mb-1">Nghiệm phức x₂</p>
            <p className="text-white/60 font-mono text-sm">
              {formatNum(realPart)} - {formatNum(imagPart)}i
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function StepsSection({
  result,
  a,
  b,
  c,
}: {
  result: SolutionResult;
  a: number;
  b: number;
  c: number;
}) {
  if (!result) return null;
  if (result.type === "all" || result.type === "no_solution") return null;
  void a; // used in template strings below

  const steps: { title: string; content: string }[] = [];

  if (result.type === "linear") {
    steps.push({ title: "Nhận xét", content: `a = 0, nên đây là phương trình bậc nhất.` });
    steps.push({ title: "Giải phương trình", content: `${b}x + ${c} = 0  →  ${b}x = ${-c}  →  x = ${formatNum(result.x)}` });
  } else {
    const delta = (result as any).delta as number;
    steps.push({
      title: "Bước 1: Tính delta (Δ)",
      content: `Δ = b² - 4ac = (${b})² - 4×(${a})×(${c}) = ${b * b} - ${4 * a * c} = ${formatNum(delta)}`,
    });

    if (result.type === "two") {
      steps.push({
        title: "Bước 2: Kết luận (Δ > 0)",
        content: `Δ = ${formatNum(delta)} > 0 → Phương trình có 2 nghiệm phân biệt`,
      });
      steps.push({
        title: "Bước 3: Tính nghiệm",
        content:
          `x₁ = (-b + √Δ) / (2a) = (-(${b}) + √${formatNum(delta)}) / (2×${a})\n` +
          `   = (${-b} + ${formatNum(Math.sqrt(delta))}) / ${2 * a}\n` +
          `   = ${formatNum(result.x1)}\n\n` +
          `x₂ = (-b - √Δ) / (2a) = (-(${b}) - √${formatNum(delta)}) / (2×${a})\n` +
          `   = (${-b} - ${formatNum(Math.sqrt(delta))}) / ${2 * a}\n` +
          `   = ${formatNum(result.x2)}`,
      });
      steps.push({
        title: "Kiểm tra nghiệm",
        content:
          `Thay x₁=${formatNum(result.x1)}: ${a}(${formatNum(result.x1)})² + ${b}(${formatNum(result.x1)}) + ${c} ≈ ${parseFloat((a * result.x1 ** 2 + b * result.x1 + c).toFixed(6))}\n` +
          `Thay x₂=${formatNum(result.x2)}: ${a}(${formatNum(result.x2)})² + ${b}(${formatNum(result.x2)}) + ${c} ≈ ${parseFloat((a * result.x2 ** 2 + b * result.x2 + c).toFixed(6))}`,
      });
    } else if (result.type === "one") {
      steps.push({
        title: "Bước 2: Kết luận (Δ = 0)",
        content: `Δ = 0 → Phương trình có nghiệm kép`,
      });
      steps.push({
        title: "Bước 3: Tính nghiệm kép",
        content: `x₁ = x₂ = -b / (2a) = -(${b}) / (2×${a}) = ${-b} / ${2 * a} = ${formatNum(result.x)}`,
      });
    } else if (result.type === "none") {
      steps.push({
        title: "Bước 2: Kết luận (Δ < 0)",
        content: `Δ = ${formatNum(delta)} < 0 → Phương trình vô nghiệm thực (chỉ có nghiệm phức)`,
      });
    }
  }

  return (
    <div className="mt-4 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-5">
      <h2 className="text-white/80 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="text-lg">📋</span> Các bước giải
      </h2>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white/5 border border-white/10 rounded-2xl p-4"
          >
            <p className="text-cyan-400 font-semibold text-sm mb-2">{step.title}</p>
            <pre className="text-white/80 text-sm font-mono whitespace-pre-wrap leading-relaxed">
              {step.content}
            </pre>
          </div>
        ))}
      </div>

      {/* Vi-et formulas */}
      {(result.type === "two" || result.type === "one") && (
        <div className="mt-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4">
          <p className="text-purple-300 font-semibold text-sm mb-2">🔢 Định lý Vi-ét</p>
          <div className="font-mono text-white/70 text-sm space-y-1">
            <p>
              x₁ + x₂ = -b/a = {formatNum(-b / a)}{" "}
              {result.type === "two"
                ? `(kiểm tra: ${formatNum(result.x1)} + ${formatNum(result.x2)} = ${formatNum(result.x1 + result.x2)})`
                : `(kiểm tra: ${formatNum(result.x)} + ${formatNum(result.x)} = ${formatNum(result.x * 2)})`}
            </p>
            <p>
              x₁ × x₂ = c/a = {formatNum(c / a)}{" "}
              {result.type === "two"
                ? `(kiểm tra: ${formatNum(result.x1)} × ${formatNum(result.x2)} = ${formatNum(result.x1 * result.x2)})`
                : `(kiểm tra: ${formatNum(result.x)} × ${formatNum(result.x)} = ${formatNum(result.x * result.x)})`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
