#!/usr/bin/env python3
"""
定时更新 04-trends.md 中的前沿趋势题
每月运行一次，调用 Claude API 生成基于当前时间的最新趋势题
"""

import os
import sys
import re
from datetime import datetime
import anthropic

TRENDS_FILE = "docs/05-interview/04-trends.md"

SYSTEM_PROMPT = """你是一位专注 AI 产品经理求职辅导的专家，熟悉最新 AI 技术动态和大厂面试趋势。
你的任务是生成高质量的 AI PM 面试开放题，内容必须反映当前（{year}年{month}月）最新的 AI 行业动态。

每道题严格遵循六段式结构：
- 难度和考察公司标注
- **③ 标准答案**（200字以上，可含表格/框架）
- **④ 前沿加分回答**（引用{year}年的具体产品/论文/事件，100字以内）
- **⑤ 常见踩坑点**（3条，用 ❌ 开头）
- **⑥ 回答策略**（开场句 + 时间分配 + 追问预判）

输出格式：直接输出 Markdown，不要有任何前言或解释，题目格式：**Q编号：题目**，每题之间用 --- 分隔。"""

PROMPT_PART1 = """请为 {year}年{month}月 生成以下 5 道 AI PM 面试前沿趋势题：

## 第一部分：技术演进与架构

生成 Q1、Q2、Q3、Q4 共 4 道题，主题围绕：推理模型/多模态/开源模型竞争/Agent标准化等{year}年最新进展。

## 第二部分：数据与训练

生成 Q5 共 1 道题，主题围绕：合成数据/训练范式/数据飞轮等方向。

从 ## 第一部分 开始直接输出，不要有前言。"""

PROMPT_PART2 = """请为 {year}年{month}月 继续生成以下 4 道 AI PM 面试前沿趋势题：

## 第二部分：数据与训练（续）

生成 Q6 共 1 道题，主题围绕：数据质量/标注/评估数据集等方向。

## 第三部分：应用落地与挑战

生成 Q7、Q8、Q9 共 3 道题，主题围绕：具身智能/隐私安全/行业颠覆性应用等{year}年落地案例。

从 ## 第二部分（续） 开始直接输出，不要有前言。"""


def read_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_file(path: str, content: str):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def call_api(client, system: str, user: str) -> str:
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8192,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    return message.content[0].text


def generate_trends(year: int, month: int) -> str:
    base_url = os.environ.get("ANTHROPIC_BASE_URL")
    client = anthropic.Anthropic(
        api_key=os.environ["ANTHROPIC_API_KEY"],
        **({"base_url": base_url} if base_url else {}),
    )

    system = SYSTEM_PROMPT.format(year=year, month=month)

    print(f"第1次调用：生成第一/二部分（Q1-Q5）...")
    part1 = call_api(client, system, PROMPT_PART1.format(year=year, month=month))
    q1 = part1.count("**Q")
    print(f"  → 生成 {q1} 道题")

    print(f"第2次调用：生成第二/三部分（Q6-Q9）...")
    part2 = call_api(client, system, PROMPT_PART2.format(year=year, month=month))
    q2 = part2.count("**Q")
    print(f"  → 生成 {q2} 道题")

    result = part1.strip() + "\n\n---\n\n" + part2.strip()
    q_total = result.count("**Q")

    if q_total < 8:
        print(f"ERROR: 生成题目数不足（共 {q_total} 道），跳过更新")
        sys.exit(1)

    print(f"✓ 生成完成，共 {q_total} 道题")
    return result


def update_trends_file(new_questions: str, year: int, month: int):
    original = read_file(TRENDS_FILE)

    # 保留页头（frontmatter 到"使用指南"结束）
    header_match = re.search(r"^(---\n.*?---\n.*?---\n)", original, re.DOTALL)
    if not header_match:
        # fallback：保留到第一个 ## 第一部分 之前
        split_marker = "## 第一部分"
        idx = original.find(split_marker)
        if idx == -1:
            print("ERROR: 找不到分割点，跳过更新")
            sys.exit(1)
        header = original[:idx]
    else:
        header = header_match.group(1)
        split_marker = "## 第一部分"
        idx = original.find(split_marker)
        header = original[:idx]

    # 保留页尾（答题技巧 + TrendRadar 组件）
    footer_marker = "## 答题技巧"
    footer_idx = original.find(footer_marker)
    if footer_idx == -1:
        print("ERROR: 找不到答题技巧章节，跳过更新")
        sys.exit(1)
    footer = original[footer_idx:]

    # 组装新文件，注入更新时间注释
    update_note = f"> 本页题目由 AI 自动更新，最后更新：{year}年{month}月\n\n"
    new_content = header + update_note + new_questions.strip() + "\n\n---\n\n" + footer

    write_file(TRENDS_FILE, new_content)
    print(f"✓ {TRENDS_FILE} 已更新（{year}年{month}月）")


def main():
    now = datetime.utcnow()
    year, month = now.year, now.month

    if "ANTHROPIC_API_KEY" not in os.environ:
        print("ERROR: 未设置 ANTHROPIC_API_KEY 环境变量")
        sys.exit(1)

    new_questions = generate_trends(year, month)
    update_trends_file(new_questions, year, month)


if __name__ == "__main__":
    main()
