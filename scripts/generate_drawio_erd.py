"""
generate_drawio_erd.py
======================
Auto-generate ERD draw.io XML from prisma/schema.prisma.

Usage:
    python scripts/generate_drawio_erd.py

Output:
    docs/diagrams/erd.drawio  (overwritten on each run)

Requirements:
    Python 3.8+ — no external dependencies needed.
"""

import re
import os
import sys


# ─────────────────────────────────────────────
# 1. PARSER
# ─────────────────────────────────────────────

def parse_prisma_schema(schema_path: str) -> dict:
    """Parse Prisma schema into a dict of models and enums."""
    with open(schema_path, "r", encoding="utf-8") as f:
        content = f.read()

    models: dict[str, dict] = {}
    enums: dict[str, list] = {}

    # --- Parse enums ---
    for match in re.finditer(r"enum\s+(\w+)\s*\{([^}]+)\}", content, re.DOTALL):
        enum_name = match.group(1)
        values = [v.strip() for v in match.group(2).split() if v.strip() and not v.strip().startswith("//")]
        enums[enum_name] = values

    # --- Parse models ---
    for match in re.finditer(r"model\s+(\w+)\s*\{([^}]+)\}", content, re.DOTALL):
        model_name = match.group(1)
        body = match.group(2)
        fields = []
        relations = []

        for line in body.splitlines():
            line = line.strip()
            if not line or line.startswith("//") or line.startswith("@@"):
                continue

            parts = line.split()
            if len(parts) < 2:
                continue

            field_name = parts[0]
            field_type = parts[1].rstrip("?").rstrip("[]")
            is_optional = "?" in parts[1]
            is_array = "[]" in parts[1]
            is_pk = "@id" in line
            is_fk = "@relation" in line
            is_unique = "@unique" in line

            # Detect relation fields (reference another model)
            if field_type[0].isupper() and field_type not in enums and field_type != model_name:
                if not is_array:  # only track FK side, not back-relation arrays
                    relations.append({
                        "field": field_name,
                        "ref_model": field_type,
                        "is_array": is_array,
                        "on_delete": "Cascade" if "onDelete: Cascade" in line else None,
                    })
                continue

            # Map Prisma types → SQL-like labels
            type_map = {
                "String": "VARCHAR",
                "Int": "INT",
                "Boolean": "BOOLEAN",
                "DateTime": "TIMESTAMP",
                "Decimal": "DECIMAL",
                "Float": "FLOAT",
            }
            display_type = type_map.get(field_type, field_type)

            # Extract precision if @db.Decimal(x, y)
            precision_match = re.search(r"@db\.Decimal\((\d+,\s*\d+)\)", line)
            if precision_match:
                display_type = f"DECIMAL({precision_match.group(1)})"

            modifiers = []
            if is_pk:
                modifiers.append("PK")
            if is_unique:
                modifiers.append("UNIQUE")
            if is_fk:
                modifiers.append("FK")
            if is_optional:
                modifiers.append("NULL")

            label = f"{'🔑 ' if is_pk else '🔗 ' if is_fk else ''}{field_name}: {display_type}"
            if modifiers:
                label += f"  [{', '.join(modifiers)}]"

            fields.append({"label": label, "is_pk": is_pk, "is_fk": is_fk})

        models[model_name] = {"fields": fields, "relations": relations}

    return {"models": models, "enums": enums}


# ─────────────────────────────────────────────
# 2. LAYOUT CALCULATOR
# ─────────────────────────────────────────────

LAYOUT = {
    "Category":        (40,   60),
    "Product":         (340,  40),
    "Transaction":     (40,   420),
    "TransactionItem": (340,  360),
    "StoreConfig":     (700,  60),
    "PaymentMethod":   (700,  420),
}

TABLE_WIDTH   = 260
ROW_HEIGHT    = 24
HEADER_HEIGHT = 32
ENUM_WIDTH    = 180


# ─────────────────────────────────────────────
# 3. XML GENERATORS
# ─────────────────────────────────────────────

COLORS = {
    "Category":        ("#dae8fc", "#6c8ebf"),
    "Product":         ("#d5e8d4", "#82b366"),
    "Transaction":     ("#fff2cc", "#d6b656"),
    "TransactionItem": ("#f8cecc", "#b85450"),
    "StoreConfig":     ("#e1d5e7", "#9673a6"),
    "PaymentMethod":   ("#ffe6cc", "#d79b00"),
}


def xml_escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def gen_model_xml(model_name: str, data: dict, x: int, y: int, cell_id_prefix: str) -> tuple[str, int, int]:
    """Generate draw.io XML for a single model table. Returns (xml, width, height)."""
    fill, stroke = COLORS.get(model_name, ("#f5f5f5", "#666666"))
    fields = data["fields"]
    height = HEADER_HEIGHT + len(fields) * ROW_HEIGHT + 4

    lines = [
        f'    <!-- ===== {model_name} ===== -->',
        f'    <mxCell id="{cell_id_prefix}" value="{xml_escape(model_name)}" '
        f'style="swimlane;fontStyle=1;align=center;startSize={HEADER_HEIGHT};'
        f'fillColor={fill};strokeColor={stroke};rounded=1;" '
        f'vertex="1" parent="1">',
        f'      <mxGeometry x="{x}" y="{y}" width="{TABLE_WIDTH}" height="{height}" as="geometry" />',
        f'    </mxCell>',
    ]

    for i, field in enumerate(fields):
        row_y = HEADER_HEIGHT + i * ROW_HEIGHT
        pk_style = "fontStyle=1;" if field["is_pk"] else ""
        fk_color = "fontColor=#CC0000;" if field["is_fk"] else ""
        row_id = f"{cell_id_prefix}_f{i}"
        lines.append(
            f'    <mxCell id="{row_id}" value="{xml_escape(field["label"])}" '
            f'style="text;strokeColor=none;fillColor=none;align=left;'
            f'verticalAlign=middle;spacingLeft=6;fontSize=11;{pk_style}{fk_color}" '
            f'vertex="1" parent="{cell_id_prefix}">'
        )
        lines.append(
            f'      <mxGeometry y="{row_y}" width="{TABLE_WIDTH}" height="{ROW_HEIGHT}" as="geometry" />'
        )
        lines.append(f'    </mxCell>')

    return "\n".join(lines), TABLE_WIDTH, height


def gen_enum_xml(enum_name: str, values: list, x: int, y: int, cell_id_prefix: str) -> str:
    fill, stroke = COLORS.get(enum_name, ("#ffe6cc", "#d79b00"))
    height = HEADER_HEIGHT + 10 + len(values) * ROW_HEIGHT

    lines = [
        f'    <!-- ===== {enum_name} (Enum) ===== -->',
        f'    <mxCell id="{cell_id_prefix}" value="&lt;&lt;enumeration&gt;&gt;&#xa;{xml_escape(enum_name)}" '
        f'style="swimlane;fontStyle=3;align=center;startSize={HEADER_HEIGHT + 10};'
        f'fillColor={fill};strokeColor={stroke};rounded=1;" '
        f'vertex="1" parent="1">',
        f'      <mxGeometry x="{x}" y="{y}" width="{ENUM_WIDTH}" height="{height}" as="geometry" />',
        f'    </mxCell>',
    ]

    for i, val in enumerate(values):
        row_y = HEADER_HEIGHT + 10 + i * ROW_HEIGHT
        row_id = f"{cell_id_prefix}_v{i}"
        lines.append(
            f'    <mxCell id="{row_id}" value="{xml_escape(val)}" '
            f'style="text;strokeColor=none;fillColor=none;align=center;'
            f'verticalAlign=middle;fontSize=11;" vertex="1" parent="{cell_id_prefix}">'
        )
        lines.append(
            f'      <mxGeometry y="{row_y}" width="{ENUM_WIDTH}" height="{ROW_HEIGHT}" as="geometry" />'
        )
        lines.append(f'    </mxCell>')

    return "\n".join(lines)


def gen_edge_xml(edge_id: str, source: str, target: str, label: str, style: str) -> str:
    return (
        f'    <mxCell id="{edge_id}" value="{xml_escape(label)}" '
        f'style="{style}" edge="1" source="{source}" target="{target}" parent="1">\n'
        f'      <mxGeometry relative="1" as="geometry" />\n'
        f'    </mxCell>'
    )


# ─────────────────────────────────────────────
# 4. MAIN GENERATOR
# ─────────────────────────────────────────────

def generate_drawio_xml(schema: dict) -> str:
    models = schema["models"]
    enums = schema["enums"]

    cells = []
    edge_cells = []
    edge_idx = 0

    # --- Generate model cells ---
    for model_name, data in models.items():
        x, y = LAYOUT.get(model_name, (40, 40))
        prefix = f"m_{model_name}"

        if model_name in enums:
            # It's an enum (skip — handled separately below)
            continue

        cell_xml, _, _ = gen_model_xml(model_name, data, x, y, prefix)
        cells.append(cell_xml)

    # --- Generate enum cells ---
    for enum_name, values in enums.items():
        x, y = LAYOUT.get(enum_name, (40, 40))
        prefix = f"e_{enum_name}"
        cells.append(gen_enum_xml(enum_name, values, x, y, prefix))

    # --- Generate relationship edges ---
    EDGE_STYLES = {
        "one_to_many": "edgeStyle=orthogonalEdgeStyle;endArrow=ERmany;startArrow=ERone;strokeColor=#666666;",
        "one_to_one": "edgeStyle=orthogonalEdgeStyle;endArrow=ERone;startArrow=ERone;strokeColor=#666666;",
        "uses": "edgeStyle=orthogonalEdgeStyle;endArrow=open;dashed=1;strokeColor=#d79b00;",
    }

    relations_map = [
        # (source_model, target_model, label, style_key)
        ("Category",        "Product",         "1 → N",  "one_to_many"),
        ("Product",         "TransactionItem", "1 → N",  "one_to_many"),
        ("Transaction",     "TransactionItem", "1 → N",  "one_to_many"),
        ("Transaction",     "PaymentMethod",   "uses",   "uses"),
    ]

    for src, tgt, label, style_key in relations_map:
        edge_id = f"rel_{edge_idx}"
        edge_idx += 1
        src_id = f"m_{src}"
        tgt_id = f"e_{tgt}" if tgt in enums else f"m_{tgt}"
        edge_cells.append(gen_edge_xml(edge_id, src_id, tgt_id, label, EDGE_STYLES[style_key]))

    # --- Assemble XML ---
    all_cells = "\n\n".join(cells) + "\n\n" + "\n".join(edge_cells)

    xml = f"""<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
  <root>
    <mxCell id="0" />
    <mxCell id="1" parent="0" />

{all_cells}
  </root>
</mxGraphModel>
"""
    return xml


# ─────────────────────────────────────────────
# 5. ENTRY POINT
# ─────────────────────────────────────────────

def main():
    # Resolve paths relative to project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    schema_path = os.path.join(project_root, "prisma", "schema.prisma")
    output_path = os.path.join(project_root, "docs", "diagrams", "erd.drawio")

    if not os.path.exists(schema_path):
        print(f"[ERROR] Schema not found: {schema_path}")
        sys.exit(1)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    print(f"[INFO] Parsing schema: {schema_path}")
    schema = parse_prisma_schema(schema_path)

    model_names = list(schema["models"].keys())
    enum_names  = list(schema["enums"].keys())
    print(f"[INFO] Found {len(model_names)} models: {', '.join(model_names)}")
    print(f"[INFO] Found {len(enum_names)} enums:  {', '.join(enum_names)}")

    xml = generate_drawio_xml(schema)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(xml)

    print(f"[OK]   ERD generated: {output_path}")
    print(f"[TIP]  Open {output_path} in VS Code to view the diagram (hediet/vscode-drawio extension required)")


if __name__ == "__main__":
    main()
