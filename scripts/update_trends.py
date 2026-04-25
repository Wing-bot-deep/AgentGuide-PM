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
- **③ 标准答案**（300字以上，含表格/框架）
- **④ 前沿加分回答**（必须引用{year}年的具体产品/论文/事件）
- **⑤ 常见踩坑点**（3-4条，用 ❌ 开头）
- **⑥ 回答策略**（开场句 + 时间分配 + 追问预判）

输出格式要求：
- 直接输出 Markdown，不要有任何前言或解释
- 章节标题格式：## 第一部分：xxx / ## 第二部分：xxx / ## 第三部分：xxx
- 题目格式：**Q1：题目内容**
- 每题之间用 --- 分隔
- 共 9 道题，分布：第一部分4题（技术演进）、第二部分2题（数据与训练）、第三部分3题（应用落地）"""

USER_PROMPT = """请为 {year}年{month}月 生成 9 道 AI PM 面试前沿趋势开放题。

要求：
1. 题目必须反映 {year} 年的最新动态（如推理模型、多模态、Agent 标准化、开源模型等方向的最新进展）
2. ④前沿加分部分必须引用具体的、{year}年真实存在的产品/研究/事件
3. 覆盖三个部分：技术演进与架构（4题）、数据与训练（2题）、应用落地与挑战（3题）
4. 难度标注格式：- 难度：⭐⭐⭐ | 公司：字节、阿里等（根据题目相关性填写）

直接输出 9 道题的 Markdown 内容，从 ## 第一部分 开始。"""


def read_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_file(path: str, content: str):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def generate_trends(year: int, month: int) -> str:
    base_url = os.environ.get("ANTHROPIC_BASE_URL")
    client = anthropic.Anthropic(
        api_key=os.environ["ANTHROPIC_API_KEY"],
        **({"base_url": base_url} if base_url else {}),
    )

    system = SYSTEM_PROMPT.format(year=year, month=month)
    user = USER_PROMPT.format(year=year, month=month)

    print(f"调用 Claude API 生成 {year}年{month}月 趋势题...")
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8192,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    return message.content[0].text


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
