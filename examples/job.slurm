#!/bin/bash
#SBATCH --job-name=my_job
#SBATCH --output=my_job_%j.out
#SBATCH --error=my_job_%j.err
#SBATCH --partition=compute
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=8
#SBATCH --mem=16G
#SBATCH --time=02:00:00
#SBATCH --mail-type=END,FAIL
#SBATCH --mail-user=you@example.com
#SBATCH --nodes=1

cd "$SLURM_SUBMIT_DIR"
source ~/venv/bin/activate
python train.py --config config.yaml