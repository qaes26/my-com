FROM python:3.11-slim

# Install C++ compilers and build tools
RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Common Python Data Science Libraries
RUN pip install numpy pandas matplotlib scipy

WORKDIR /usr/src/app

# Default command (can be overridden)
CMD ["python3", "--version"]
