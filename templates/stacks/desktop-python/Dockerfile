# Headless test/CI image for {{PROJECT_TITLE}}.
# The GUI itself is not meant to run in Docker - this image exists to run the
# test suite and linters in CI, where there is no display. PySide6/Qt is pointed
# at the offscreen platform so widgets can be constructed without an X server.
#
#   docker build -t app-ci .
#   docker run --rm app-ci            # runs `{{TEST_COMMAND}}`

FROM python:3.11-slim

# Minimal Qt runtime libs so PySide6 imports on a headless box.
RUN apt-get update && apt-get install -y --no-install-recommends \
      libgl1 libegl1 libxkbcommon0 libdbus-1-3 \
    && rm -rf /var/lib/apt/lists/*

ENV QT_QPA_PLATFORM=offscreen \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY pyproject.toml ./
RUN pip install --upgrade pip && pip install -e ".[dev]"

COPY . .

CMD ["pytest"]
